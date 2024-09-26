import express from "express";
// import {WebSocketServer} from "ws"
import {ChatServer} from "./chatserver/ChatServer.js";
import {TestClientEntryPoint} from "./chatserver/testclient/TestClientEntryPoint.js";
import {TestClientTransport} from "./chatserver/testclient/TestClientTransport.js";

import {hello} from "@sp24/common/hello.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";


const app = express();
const port = 3307;

app.use(express.static("../client/dist/"));

app.get("/hello", (req: express.Request, res: express.Response) => {
    return res.status(200).send(hello());
});

const httpServer = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
})

const testEntryPoint = new TestClientEntryPoint("server1");
const server = new ChatServer([testEntryPoint]);

const testTransport1 = new TestClientTransport(testEntryPoint);
const testClient1 = await ChatClient.create(testTransport1);

setInterval(() => {
    testClient1.sendPublicChat("Hello!");
}, 1000);

const testTransport2 = new TestClientTransport(testEntryPoint);
const testClient2 = await ChatClient.create(testTransport2);

testClient2.onPublicChat.createListener(publicChat => {
    console.log(`Client ${testClient2.fingerprint}: Public chat from ${publicChat.senderFingerprint}: "${publicChat.message}"`);
})

// const wss = new WebSocketServer({ server: httpServer });
//
// wss.on("connection", (ws) => {
//     ws.send("Hello World!");
// })