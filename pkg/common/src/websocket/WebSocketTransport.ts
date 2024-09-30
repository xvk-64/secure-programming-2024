import {EventEmitter} from "../util/EventEmitter.js";
import {AnyMessage, deserialiseMessage} from "./messageserialisation.js";
import * as ws from "ws";

// Lowest level transport for websockets. Assumes the socket is already connected.
export class WebSocketTransport {
    // There are different types for browser websocket and ws websocket.
    private _webSocket: WebSocket | ws.WebSocket;

    readonly onReceiveMessage: EventEmitter<AnyMessage> = new EventEmitter();
    readonly onDisconnect: EventEmitter<void> = new EventEmitter();

    public constructor(webSocket: WebSocket | ws.WebSocket) {
        this._webSocket = webSocket;

        this._webSocket.onmessage = (event: MessageEvent) => this.onMessage(event.data);
        this._webSocket.onclose = (event: CloseEvent) => {this.onDisconnect.dispatch()};
    }

    private async onMessage(message: string) {
        // console.log(message);

        const parsed = await deserialiseMessage(message);

        if (parsed === undefined) return;

        await this.onReceiveMessage.dispatch(parsed);
    }

    public async sendMessage(message: AnyMessage): Promise<void> {
        this._webSocket.send(JSON.stringify(await message.toProtocol()))
    }
}