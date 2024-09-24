import type {ClientSendable, ServerSendable} from "@sp24/common";
import {Event} from "@sp24/common";
import type {Server2ClientSendable} from "@sp24/common/src/index.js";

// Defines a server's view of a connected client
interface IClientTransport {
    sendMessage(message: Server2ClientSendable): Promise<void>;
    onReceiveMessage: Event<ClientSendable>;
}