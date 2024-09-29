import {IServerToServerTransport} from "../IServerToServerTransport.js";
import {
    ChatData,
    HelloData,
    PublicChatData,
    ServerHelloData,
    ServerToServerSendable,
    SignedData
} from "@sp24/common/messageTypes.js";
import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import {WebSocketTransport} from "@sp24/common/websocket/WebSocketTransport.js";

export class WebsocketServerToServerTransport implements IServerToServerTransport {
    private _transport: WebSocketTransport;

    readonly onDisconnect: EventEmitter<void> = new EventEmitter();
    readonly onReceiveMessage: EventEmitter<ServerToServerSendable> = new EventEmitter();

    public constructor(transport: WebSocketTransport) {
        this._transport = transport;

        const receiveListener = transport.onReceiveMessage.createAsyncListener(async message => {
            // Filter to only server to server sendable.
            if (message.type == "client_update")
                await this.onReceiveMessage.dispatch(message);

            if (message.type == "client_update_request")
                await this.onReceiveMessage.dispatch(message);

            if (message.type == "signed_data") {
                if (message.data.type == "server_hello")
                    await this.onReceiveMessage.dispatch(message as SignedData<ServerHelloData>);
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

    sendMessage(message: ServerToServerSendable): Promise<void> {
        return this._transport.sendMessage(message);
    }

}