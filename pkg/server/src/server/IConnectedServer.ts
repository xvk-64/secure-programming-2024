

// Defines a server's view of a connected server in the neighbourhood
import type {Server2ServerSendable, ServerSendable} from "@sp24/common/src/index.js";

interface IConnectedServer {
    sendMessage(message: Server2ServerSendable): Promise<void>;
    onReceiveMessage: Event<Server2ServerSendable>;
}