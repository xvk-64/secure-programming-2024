import {type EventEmitter} from "../util/EventEmitter.js";
import {ClientSendable, ServerToClientSendable} from "../messageTypes.js";

// Client-side abstraction over the transport layer a client uses to send/receive from a server.
export interface IChatClientTransport {
    connect(): Promise<void>;

    sendMessage(message: ClientSendable): Promise<void>;
    onReceiveMessage: EventEmitter<ServerToClientSendable>;
    
    onDisconnect: EventEmitter<void>;
}