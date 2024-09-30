import express from "express";

import {ChatServer} from "./chatserver/ChatServer.js";
import {TestClientTransport} from "./chatserver/testclient/TestClientTransport.js";

import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {WebSocketEntryPoint} from "./chatserver/websocketserver/WebSocketEntryPoint.js";
import {webcrypto} from "node:crypto";
import {PEMToKey, PSSGenParams, PSSImportParams} from "@sp24/common/util/crypto.js";
import {TestEntryPoint} from "./chatserver/testclient/TestEntryPoint.js";
import * as fs from "node:fs";
import {NeighbourhoodAllowList} from "./chatserver/NeighbourhoodAllowList.js";
import * as readline from "node:readline";
import {WebsocketServerToServerTransport} from "./chatserver/websocketserver/WebsocketServerToServerTransport.js";

/*
    ------------------------------
    Secure Programming Chat Server
    ------------------------------

    Arguments:
        node server.js address [port] [privateKeyFile] [publicKeyFile] [neighbourhoodFile]

    - address:              The address used within the OLAF protocol.  Required.
    - port:                 Port to host server on.                     Default: 3307
    - privateKeyFile:       PEM PKCS-8 format file.                     Default: generate
    - publicKeyFile:        PEM SPKI format file.                       Default: generate
    - neighbourhoodFile:    JSON file specifying the neighbourhood.     Default: No neighbourhood.
 */

// Get command line arguments.
const address = process.argv[2];
const port = process.argv[3] || 3307;
const privateKeyFile = process.argv[4];
const publicKeyFile = process.argv[5];
const neighbourhoodFile = process.argv[6];

const app = express();

app.use(express.static("../client/dist/"));

if (address === undefined) {
    console.error("Need to provide address")
    process.exit(-1);
}

// Keys
let serverPublicKey: webcrypto.CryptoKey | undefined;
let serverPrivateKey: webcrypto.CryptoKey | undefined;

if (fs.existsSync(publicKeyFile) && fs.existsSync(privateKeyFile)) {
    // Load from file
    serverPrivateKey = await PEMToKey(fs.readFileSync(privateKeyFile).toString(), true, PSSImportParams);
    serverPublicKey = await PEMToKey(fs.readFileSync(publicKeyFile).toString(), false, PSSImportParams);
}

if (serverPublicKey === undefined || serverPrivateKey === undefined) {
    // Generate keys
    const serverKeyPair = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

    serverPublicKey = serverKeyPair.publicKey;
    serverPrivateKey = serverKeyPair.privateKey;
}


// Neighbourhood
let neighbourhood: NeighbourhoodAllowList = [];
let URLs: string[] = [];
if (fs.existsSync(neighbourhoodFile)) {
    const parsed = JSON.parse(fs.readFileSync(neighbourhoodFile).toString());

    if (parsed instanceof Array) {
        for (const entry of parsed) {
            if (typeof entry.address !== "string") break;
            if (typeof entry.verifyKey !== "string") break;
            if (typeof entry.URL !== "string") break;

            if (entry.address === address)
                // Don't add our own entry.
                continue;

            neighbourhood.push({
                address: entry.address,
                verifyKey: await PEMToKey(entry.verifyKey, false, PSSImportParams)
            });

            URLs.push(entry.URL);
        }
    }
}

const httpServer = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
});

const wsEntryPoint = new WebSocketEntryPoint(httpServer, neighbourhood);
const testEntryPoint = new TestEntryPoint(neighbourhood);
const server = new ChatServer(address, [wsEntryPoint, testEntryPoint], serverPrivateKey, serverPublicKey);

const client1Keys = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);
const testTransport1 = new TestClientTransport(testEntryPoint);
const testClient1 = await ChatClient.create(testTransport1, client1Keys.privateKey, client1Keys.publicKey);

// Try connecting to other servers
for (const URL of URLs) {
    const transport = await WebsocketServerToServerTransport.connect(URL);

    if (transport !== undefined) {
        console.log(`Connecting to ${URL}`)
        await wsEntryPoint.connectToServer(transport, await server.createServerHelloMessage())
    }
}

setInterval(() => {
    testClient1.sendPublicChat("Yay!");
}, 1000);

testClient1.onPublicChat.createListener(message => {
    console.log(`message: ${message.message} from ${message.senderFingerprint}`)
})
testClient1.onChat.createListener(message => {
    console.log(`message: ${message.message} from ${message.senderFingerprint} ${message.groupID}`)
})
