import { EventEmitter } from "@sp24/common/util/EventEmitter.js";
import { IServerToClientTransport } from "../IServerToClientTransport.js";
import { ClientSendable, ServerToClientSendable } from "@sp24/common/messageTypes.js";

export class WebSocketServerToClientTransport implements IServerToClientTransport {
    private _webSocket: WebSocket;

    onDisconnect: EventEmitter<void> = new EventEmitter<void>();
    onReceiveMessage: EventEmitter<ClientSendable> = new EventEmitter<ClientSendable>();

    sendMessage(message: ServerToClientSendable): Promise<void> {
        const messageString = JSON.stringify(message);
        this._webSocket.send(messageString);
        return Promise.resolve();
    }

    public constructor(webSocket: WebSocket) {
        this._webSocket = webSocket;
        this._webSocket.addEventListener("message", (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "signed_data" || message.type === "client_list_request")
                    this.onReceiveMessage.dispatch(event.data as ClientSendable);
            } catch {}
        });
        this._webSocket.addEventListener("close", (event) => {
            this.onDisconnect.dispatch();
        });
    }
}