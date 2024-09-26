import {Event} from "@sp24/common/util/Event.js";
import {ClientSendable, ServerToClientSendable} from "@sp24/common/messageTypes.js";

// Defines a server's view of a connected client
export interface IServerToClientTransport {
    sendMessage(message: ServerToClientSendable): Promise<void>;
    onReceiveMessage: Event<ClientSendable>;

    onDisconnect: Event<void>;
}