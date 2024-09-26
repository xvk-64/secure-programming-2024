import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import {ClientSendable, ServerToClientSendable} from "@sp24/common/messageTypes.js";

// Defines a server's view of a connected client
export interface IServerToClientTransport {
    sendMessage(message: ServerToClientSendable): Promise<void>;
    onReceiveMessage: EventEmitter<ClientSendable>;

    onDisconnect: EventEmitter<void>;
}