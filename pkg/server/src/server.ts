import express from "express";

import {ChatServer} from "./chatserver/ChatServer.js";
import {TestClientTransport} from "./chatserver/testclient/TestClientTransport.js";

import {hello} from "@sp24/common/hello.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {WebSocketEntryPoint} from "./chatserver/websocketserver/WebSocketEntryPoint.js";
import {webcrypto} from "node:crypto";
import {PSSGenParams} from "@sp24/common/util/crypto.js";
import {TestEntryPoint} from "./chatserver/testclient/TestEntryPoint.js";


const app = express();
const port = 3307;

app.use(express.static("../client/dist/"));

app.get("/hello", (req: express.Request, res: express.Response) => {
    return res.status(200).send(hello());
});

const httpServer = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
});

const serverKeyPair = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);
const wsEntryPoint = new WebSocketEntryPoint(httpServer, []);
const testEntryPoint = new TestEntryPoint([]);
const server = new ChatServer("server1", [wsEntryPoint, testEntryPoint], serverKeyPair.privateKey, serverKeyPair.publicKey);

const client1Keys = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);
const testTransport1 = new TestClientTransport(testEntryPoint);
const testClient1 = await ChatClient.create(testTransport1, client1Keys.privateKey, client1Keys.publicKey);

setInterval(() => {
    testClient1.sendPublicChat("Yay!");
}, 1000);

testClient1.onPublicChat.createListener(message => {
    console.log(`message: ${message.message} from ${message.senderFingerprint}`)
})
testClient1.onChat.createListener(message => {
    console.log(`message: ${message.message} from ${message.senderFingerprint} ${message.groupID}`)
})

// const wss = new WebSocketServer({ server: httpServer });
//
// wss.on("connection", (ws) => {
//     ws.send("Hello World!");
// })