import {EventEmitter} from "@sp24/common/util/EventEmitter.js"
import type {IServerToServerTransport} from "./IServerToServerTransport.js";
import {IServerToClientTransport} from "./IServerToClientTransport.js";

// Defines an entry point for new connections to a server.
export interface IServerEntryPoint {
    get address(): string;

    onClientConnect: EventEmitter<IServerToClientTransport>;
    onServerConnect: EventEmitter<IServerToServerTransport>;
}