import {Event} from "@sp24/common/util/Event.js"
import type {IConnectedClient} from "./IConnectedClient.js";
import type {IConnectedServer} from "./IConnectedServer.js";

// Defines an entry point for new connections to a server.
export interface IServerEntryPoint {
    onClientConnect: Event<IConnectedClient>;
    onServerConnect: Event<IConnectedServer>;
}