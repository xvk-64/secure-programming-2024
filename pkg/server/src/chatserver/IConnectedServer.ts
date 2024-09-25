import {Event} from "@sp24/common/util/Event.js";
import {ServerToServerSendable} from "@sp24/common/messageTypes.js";

// Defines a server's view of a connected server in the neighbourhood
export interface IConnectedServer {
    sendMessage(message: ServerToServerSendable): Promise<void>;
    onReceiveMessage: Event<ServerToServerSendable>;
}