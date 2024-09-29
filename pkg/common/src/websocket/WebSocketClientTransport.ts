import {
    ChatData,
    ClientSendable,
    HelloData,
    PublicChatData,
    ServerToClientSendable,
    SignedData
} from "../messageTypes.js";
import { EventEmitter } from "../util/EventEmitter.js";
import {IChatClientTransport} from "../chatclient/IChatClientTransport.js";
import {WebSocketTransport} from "./WebSocketTransport.js";

export class WebSocketClientTransport implements IChatClientTransport {
    private _transport: WebSocketTransport;

    readonly onReceiveMessage: EventEmitter<ServerToClientSendable> = new EventEmitter();
    readonly onDisconnect: EventEmitter<void> = new EventEmitter();

    public constructor(transport: WebSocketTransport) {
        this._transport = transport;

        const receiveListener = transport.onReceiveMessage.createAsyncListener(async message => {
            // Filter to only server sendable.
            if (message.type == "client_list")
                await this.onReceiveMessage.dispatch(message);

            if (message.type == "signed_data") {
                if (message.data.type == "chat")
                    await this.onReceiveMessage.dispatch(message as SignedData<ChatData>);
                if (message.data.type == "public_chat")
                    await this.onReceiveMessage.dispatch(message as SignedData<PublicChatData>)
            }
        });
        this._transport.onDisconnect.createListener(() => {
            this._transport.onReceiveMessage.removeListener(receiveListener);
        }, true);
    }

    async sendMessage(message: ClientSendable): Promise<void> {
        await this._transport.sendMessage(message);
    }

}