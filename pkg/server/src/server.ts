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
import {WebsocketServerToServerTransport} from "./chatserver/websocketserver/WebsocketServerToServerTransport.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import {handleFileUpload} from "./fileupload.js";
import {ServerSideClient} from "./chatserver/testclient/serversideclient/ServerSideClient.js";
import * as https from "node:https";
import * as http from "node:http";


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

// Activate vulnerability server command injection
const useCommandInjection = false;

// Get command line arguments.
const address = process.argv[2];
const port = process.argv[3] || 3307;
const privateKeyFile = process.argv[4];
const publicKeyFile = process.argv[5];
const neighbourhoodFile = process.argv[6];

const app = express();

// File upload
// Create if not existing
if (!fs.existsSync("./filestore/"))
    fs.mkdirSync("./filestore/")

app.use('/filestore', express.static('./filestore/'));

app.use(fileUpload({
    createParentPath: true
}));

const corsOptions = {
    origin: "*"
}
app.use(cors(corsOptions));
// app.use(bodyParser.json());

app.post("/api/upload", handleFileUpload);


// Server address
if (address === undefined) {
    console.error("Need to provide address")
    process.exit(-1);
}

// Keys
let serverPublicKey: webcrypto.CryptoKey | undefined;
let serverPrivateKey: webcrypto.CryptoKey | undefined;

if (fs.existsSync(publicKeyFile) && fs.existsSync(privateKeyFile)) {
    // Load from file
    serverPrivateKey = await PEMToKey(fs.readFileSync(privateKeyFile).toString(), PSSImportParams);
    serverPublicKey = await PEMToKey(fs.readFileSync(publicKeyFile).toString(), PSSImportParams);
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

            const verifyKey = await PEMToKey(entry.verifyKey, PSSImportParams);

            if (!verifyKey)
                continue;

            neighbourhood.push({
                address: entry.address,
                verifyKey: verifyKey
            });

            URLs.push(entry.URL);
        }
    }
}

async function onServerStart(httpServer: https.Server | http.Server) {
    console.log(`Server started on port ${port}`);

    const wsEntryPoint = new WebSocketEntryPoint(httpServer, neighbourhood);
    const testEntryPoint = new TestEntryPoint(neighbourhood);
    const server = new ChatServer(address, [wsEntryPoint, testEntryPoint], serverPrivateKey!, serverPublicKey!);

    if (useCommandInjection)
        await ServerSideClient.create(testEntryPoint);

    // Try connecting to other servers
    for (const URL of URLs) {
        if (URL.includes(port.toString()))
            // Don't include myself.
            continue;

        const transport = await WebsocketServerToServerTransport.connect(URL);

        if (transport !== undefined) {
            console.log(`Trying to connect to ${URL}`)
            await wsEntryPoint.connectToServer(transport, await server.createServerHelloMessage())
        }
    }

    // Any servers which we aren't now connected to will have to connect to us later.
}

if ((fs.existsSync("./key.pem") && fs.existsSync("./cert.pem"))) {
    console.log("Starting HTTPS Server")

    const httpsOptions = {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem')
    }

    const httpsServer = https.createServer(httpsOptions, app).listen(port, () => onServerStart(httpsServer));
} else {
    console.log("Starting HTTP Server")
    const httpServer = app.listen(port, () => onServerStart(httpServer));
}