import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import {ServerToServerSendable} from "@sp24/common/messageTypes.js";

// Defines a server's view of a connected server in the neighbourhood
export interface IServerToServerTransport {
    sendMessage(message: ServerToServerSendable): Promise<void>;
    onReceiveMessage: EventEmitter<ServerToServerSendable>;
}