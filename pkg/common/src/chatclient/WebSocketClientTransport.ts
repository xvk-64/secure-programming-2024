import { ClientSendable, ServerToClientSendable } from "../messageTypes.js";
import { EventEmitter } from "../util/EventEmitter.js";
import { IChatClientTransport } from "./IChatClientTransport.js";

const address = "wss://localhost:3307/"
export class WebSocketClientTransport implements IChatClientTransport {
    private _webSocket: WebSocket | null = null;

    connect(): Promise<void> {
        if(this._webSocket) {
            this._webSocket.close();
        }
        this._webSocket = new WebSocket(address);
        return Promise.resolve();
    }

    onReceiveMessage: EventEmitter<ServerToClientSendable> = new EventEmitter<ServerToClientSendable>();

    sendMessage(message: ClientSendable): Promise<void> {
        this._webSocket?.send(JSON.stringify(message));
        return Promise.resolve();
    }
}