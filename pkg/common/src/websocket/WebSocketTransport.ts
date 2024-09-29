import {EventEmitter} from "../util/EventEmitter.js";
import {AnyMessage, deserialiseMessage} from "./messageserialisation.js";


// Lowest level transport for websockets. Assumes the socket is already connected.
export class WebSocketTransport {
    private _webSocket: WebSocket;

    readonly onReceiveMessage: EventEmitter<AnyMessage> = new EventEmitter();
    readonly onDisconnect: EventEmitter<void> = new EventEmitter();

    public constructor(webSocket: WebSocket) {
        this._webSocket = webSocket;

        this._webSocket.onmessage = event => this.onMessage(event.data);
        this._webSocket.onclose = event => this.onDisconnect.dispatch();
    }

    private async onMessage(message: string) {
        const parsed = await deserialiseMessage(message);

        if (parsed === undefined) return;

        await this.onReceiveMessage.dispatch(parsed);
    }

    public async sendMessage(message: AnyMessage): Promise<void> {
        this._webSocket.send(JSON.stringify(await message.toProtocol()))
    }

    public static async connect(URL: string): Promise<WebSocketTransport | undefined> {
        return new Promise((resolve, reject) => {
            const webSocket = new WebSocket(URL);
            webSocket.onopen = () => resolve(new WebSocketTransport(webSocket));
            webSocket.onerror = () => reject();
        });
    }
}