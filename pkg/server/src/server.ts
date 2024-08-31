import {hello} from "@sp24/common"
import express from "express";
import {WebSocketServer} from "ws"

const app = express();
const port = 3307;

app.use(express.static("../client/dist/"));

app.get("/hello", (req: express.Request, res: express.Response) => {
    return res.status(200).send(hello());
});

const httpServer = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
})

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
    ws.send("Hello World!");
})