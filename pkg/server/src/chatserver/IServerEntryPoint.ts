import {EventEmitter} from "@sp24/common/util/EventEmitter.js"
import type {IServerToServerTransport} from "./IServerToServerTransport.js";
import {IServerToClientTransport} from "./IServerToClientTransport.js";
import {webcrypto} from "node:crypto";
import {ConnectedClient} from "./ConnectedClient.js";
import {ConnectedServer} from "./ConnectedServer.js";

// Defines an entry point for new connections to a server.
export interface IServerEntryPoint {
    onClientConnect: EventEmitter<ConnectedClient>;
    onServerConnect: EventEmitter<ConnectedServer>;
}