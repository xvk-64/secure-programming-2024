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

const testTransport2 = new TestClientTransport(testEntryPoint);
const testClient2 = await ChatClient.create(testTransport2);

setInterval(() => {
    testClient1.sendChat("Hello!", testClient1.getGroupID([testClient2.fingerprint]));
}, 1000);


testClient2.onChat.createListener(chat => {
    console.log(`Client ${testClient2.fingerprint}: Chat from ${chat.senderFingerprint}: "${chat.message}" GroupID: ${chat.groupID}`);
})

// const wss = new WebSocketServer({ server: httpServer });
//
// wss.on("connection", (ws) => {
//     ws.send("Hello World!");
// })