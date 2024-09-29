import { ClientSendable, HelloData, ServerToClientSendable, SignedData } from "../messageTypes.js";
import { EventEmitter } from "../util/EventEmitter.js";
import { IChatClientTransport } from "./IChatClientTransport.js";

// note there was a big issue if the server address wasn't correct
// nothing worked, there are no fall back mechanisms yet.
const address = "ws://localhost:3307/"
export class WebSocketClientTransport implements IChatClientTransport {
    private _webSocket: WebSocket | null = null;

    private async onMessage(message: string) {
        // convert the message to the protocol
        const bs: any = "ahhhh";
        this.onReceiveMessage.dispatch(bs as ServerToClientSendable);
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this._webSocket) {
                this._webSocket.close();
            }
            this._webSocket = new WebSocket(address);
            this._webSocket.addEventListener("message", (event) => {
                this.onMessage(event.data);
            });
            this._webSocket.addEventListener("open", () => {
                resolve();
            });
            this._webSocket.addEventListener("error", () => {
                reject();
            });
        });
    }

    onReceiveMessage: EventEmitter<ServerToClientSendable> = new EventEmitter<ServerToClientSendable>();

    sendMessage(message: ClientSendable): Promise<void> {
        if(!this._webSocket)
            return Promise.reject();
        this._webSocket.send(JSON.stringify(message.toProtocol()));
        return Promise.resolve();
    }
}