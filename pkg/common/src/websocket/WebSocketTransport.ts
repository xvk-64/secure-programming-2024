import {EventEmitter, EventQueue} from "../util/EventEmitter.js";
import {deserialiseMessage} from "./messageserialisation.js";
import * as ws from "ws";
import {Mutex} from "async-mutex";
import {AnyMessage} from "../messageTypes.js";

const TimeoutInterval = 1000;

// Lowest level transport for websockets. Assumes the socket is already connected.
export class WebSocketTransport {
    // There are different types for browser websocket and ws websocket.
    private _webSocket: WebSocket | ws.WebSocket;

    private _mutex = new Mutex();

    readonly onReceiveMessage: EventQueue<AnyMessage> = new EventQueue();
    readonly onDisconnect: EventEmitter<void> = new EventEmitter();

    private constructor(webSocket: WebSocket | ws.WebSocket) {
        this._webSocket = webSocket;

        this._webSocket.onmessage = (event: MessageEvent) => this.onMessage(event.data);
        this._webSocket.onclose = (event: CloseEvent) => {this.onDisconnect.dispatch()};
        this._webSocket.onerror = (event: Event) => {
            console.log(event)

            if (this._webSocket.readyState === WebSocket.CLOSED)
                this.onDisconnect.dispatch();
        };
    }

    private async onMessage(message: string) {
        await this._mutex.runExclusive(async () => {
            const parsed = await deserialiseMessage(message);

            if (parsed === undefined) return;

            // const j = i++;
            // console.log(`r start ${j} ${parsed.type} ${parsed.type == "signed_data" ? parsed.data.type : ""}`);

            await this.onReceiveMessage.dispatch(parsed);

            // console.log(`r end ${j}`);
        })
    }

    public async sendMessage(message: AnyMessage): Promise<void> {
        // console.log(`s ${message.type} ${message.type == "signed_data" ? message.data.type : ""}`);

        this._webSocket.send(JSON.stringify(await message.toProtocol()))
    }

    public static createClient(webSocket: WebSocket): WebSocketTransport {
        return new WebSocketTransport(webSocket);
    }
    public static createServer(webSocket: ws.WebSocket): WebSocketTransport {
        let isAlive = true;

        const transport = new WebSocketTransport(webSocket);

        webSocket.on("pong", () => {
            isAlive = true;
        })

        webSocket.on("ping", () => {
            webSocket.pong();
        })

        webSocket.on("close", () => {
            // console.log("Websocket timed out!")
            clearInterval(timeoutInterval);

            transport.onDisconnect.dispatch();
        })

        const timeoutInterval = setInterval(() => {
            if (!isAlive) {
                webSocket.terminate();
            }

            isAlive = false;
            webSocket.ping();
        }, TimeoutInterval);

        return transport;
    }
}