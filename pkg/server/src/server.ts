import express from "express";
// import {WebSocketServer} from "ws"
import {ChatServer} from "./chatserver/ChatServer.js";
import {TestEntryPoint} from "./chatserver/testclient/TestEntryPoint.js";
import {TestClientTransport} from "./chatserver/testclient/TestClientTransport.js";

import {hello} from "@sp24/common/hello.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {webcrypto} from "node:crypto";
import {PSSGenParams} from "@sp24/common/util/crypto.js";


const app = express();
const port = 3307;

app.use(express.static("../client/dist/"));

app.get("/hello", (req: express.Request, res: express.Response) => {
    return res.status(200).send(hello());
});

const httpServer = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
})

const keyPair = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

const testEntryPoint = new TestEntryPoint("server1", keyPair.privateKey, keyPair.publicKey);
const server = new ChatServer([testEntryPoint]);

const testTransport1 = new TestClientTransport(testEntryPoint);
const testClient1 = await ChatClient.create(testTransport1);

const testTransport2 = new TestClientTransport(testEntryPoint);
const testClient2 = await ChatClient.create(testTransport2);

const testTransport3 = new TestClientTransport(testEntryPoint);
const testClient3 = await ChatClient.create(testTransport3);


setInterval(() => {
    const groupID = testClient1.getGroupID([testClient2.fingerprint, testClient3.fingerprint]);

    testClient1.sendChat("Hello!", groupID);
    testClient1.sendPublicChat("Yay!");
}, 1000);


testClient2.onPublicChat.createListener(chat => {
    console.log(`Client ${testClient2.fingerprint}: Publichat from ${chat.senderFingerprint}: "${chat.message}"`);
})
testClient3.onChat.createListener(chat => {
    console.log(`Client ${testClient3.fingerprint}: Chat from ${chat.senderFingerprint}: "${chat.message}" GroupID: ${chat.groupID}`);
})

// const wss = new WebSocketServer({ server: httpServer });
//
// wss.on("connection", (ws) => {
//     ws.send("Hello World!");
// })