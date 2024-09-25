import type {ServerToServerSendable} from "@sp24/common/src/index.js";
import {Event} from "@sp24/common/src/util/Event.js"

// Defines a server's view of a connected server in the neighbourhood
export interface IConnectedServer {
    sendMessage(message: ServerToServerSendable): Promise<void>;
    onReceiveMessage: Event<ServerToServerSendable>;
}