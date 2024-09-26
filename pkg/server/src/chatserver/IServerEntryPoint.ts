import {Event} from "@sp24/common/util/Event.js"
import type {IServerToServerTransport} from "./IServerToServerTransport.js";
import {IServerToClientTransport} from "./IServerToClientTransport.js";

// Defines an entry point for new connections to a server.
export interface IServerEntryPoint {
    onClientConnect: Event<IServerToClientTransport>;
    onServerConnect: Event<IServerToServerTransport>;
}