import {hello} from "@sp24/common"
import express from "express";
import {WebSocketServer} from "ws"
import {ChatServer} from "./chatserver/ChatServer.js";
import {TestClientEntryPoint} from "./chatserver/testclient/TestClientEntryPoint.js";
import {TestClientTransport} from "./chatserver/testclient/TestClientTransport.js";
import {ChatClient} from "@sp24/common/src/index.js";

const app = express();
const port = 3307;

app.use(express.static("../client/dist/"));

app.get("/hello", (req: express.Request, res: express.Response) => {
    return res.status(200).send(hello());
});

const httpServer = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
})

const testEntryPoint = new TestClientEntryPoint()
const server = new ChatServer([testEntryPoint])

const testTransport = new TestClientTransport(testEntryPoint);
const testClient = await ChatClient.create(testTransport);

// const wss = new WebSocketServer({ server: httpServer });
//
// wss.on("connection", (ws) => {
//     ws.send("Hello World!");
// })