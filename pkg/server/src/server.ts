import {hello} from "@sp24/common"
import express from "express";

const app = express();
const port = 3307;

app.use(express.static("../client/dist/"));

app.get("/hello", (req: express.Request, res: express.Response) => {
    return res.status(200).send(hello());
});

app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
})