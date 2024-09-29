import express from "express";
// import {WebSocketServer} from "ws"
import {ChatServer} from "./chatserver/ChatServer.js";
import {TestEntryPoint} from "./chatserver/testclient/TestEntryPoint.js";
import {TestClientTransport} from "./chatserver/testclient/TestClientTransport.js";

import {hello} from "@sp24/common/hello.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {webcrypto} from "node:crypto";
import {OAEPGenParams, PSSGenParams} from "@sp24/common/util/crypto.js";
import {NeighbourhoodAllowList} from "./chatserver/NeighbourhoodAllowList.js";
import {TestServerToServerTransport} from "./chatserver/testclient/TestServerToServerTransport.js";


const app = express();
const port = 3307;

app.use(express.static("../client/dist/"));

app.get("/hello", (req: express.Request, res: express.Response) => {
    return res.status(200).send(hello());
});

const httpServer = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
})

const server1Keys = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);
const server2Keys = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

const neighbourhood: NeighbourhoodAllowList = [
    {
        address: "server1",
        verifyKey: server1Keys.publicKey
    },
    {
        address: "server2",
        verifyKey: server2Keys.publicKey
    }
]

const testEntryPoint1 = new TestEntryPoint(neighbourhood);
const server1 = new ChatServer("server1", [testEntryPoint1], server1Keys.privateKey, server1Keys.publicKey);

const [transport1to2, transport2to1] = TestServerToServerTransport.createPair();
const testEntryPoint2 = new TestEntryPoint(neighbourhood);
const server2 = new ChatServer("server2", [testEntryPoint2], server2Keys.privateKey, server2Keys.publicKey);
await testEntryPoint2.connectToServer(transport2to1, await server2.createServerHelloMessage());
await testEntryPoint1.connectToServer(transport1to2, await server1.createServerHelloMessage());

const testTransport1 = new TestClientTransport(testEntryPoint1);
const clientPair1 = await crypto.subtle.generateKey(OAEPGenParams, true, ["encrypt", "decrypt"]);
const testClient1 = await ChatClient.create(testTransport1, clientPair1.privateKey, clientPair1.publicKey);

const testTransport2 = new TestClientTransport(testEntryPoint2);
const clientPair2 = await crypto.subtle.generateKey(OAEPGenParams, true, ["encrypt", "decrypt"]);
const testClient2 = await ChatClient.create(testTransport2, clientPair2.privateKey, clientPair2.publicKey);

const testTransport3 = new TestClientTransport(testEntryPoint1);
const clientPair3 = await crypto.subtle.generateKey(OAEPGenParams, true, ["encrypt", "decrypt"]);
const testClient3 = await ChatClient.create(testTransport3, clientPair3.privateKey, clientPair3.publicKey);


setInterval(() => {
    const groupID = testClient1.getGroupID([testClient2.fingerprint, testClient3.fingerprint]);

    testClient1.sendChat("Hello!", groupID);
    testClient1.sendPublicChat("Yay!");
}, 1000);


testClient2.onPublicChat.createListener(chat => {
    console.log(`Client ${testClient2.fingerprint}: Public chat from ${chat.senderFingerprint}: "${chat.message}"`);
})
testClient2.onChat.createListener(chat => {
    console.log(`Client ${testClient2.fingerprint}: Chat from ${chat.senderFingerprint}: "${chat.message}" GroupID: ${chat.groupID}`);
})

testClient3.onPublicChat.createListener(chat => {
    console.log(`Client ${testClient3.fingerprint}: Public chat from ${chat.senderFingerprint}: "${chat.message}"`);
})
testClient3.onChat.createListener(chat => {
    console.log(`Client ${testClient3.fingerprint}: Chat from ${chat.senderFingerprint}: "${chat.message}" GroupID: ${chat.groupID}`);
})

// const wss = new WebSocketServer({ server: httpServer });
//
// wss.on("connection", (ws) => {
//     ws.send("Hello World!");
// })