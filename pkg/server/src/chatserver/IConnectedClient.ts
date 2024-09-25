import {Event} from "@sp24/common/src/util/Event.js";
import type {ClientSendable, ServerToClientSendable} from "@sp24/common/src/index.js";

// Defines a server's view of a connected client
export interface IConnectedClient {
    getIdentifier(): string;

    sendMessage(message: ServerToClientSendable): Promise<void>;
    onReceiveMessage: Event<ClientSendable>;

    onDisconnect: Event<void>;
}