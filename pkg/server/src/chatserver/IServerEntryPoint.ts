import {EventEmitter} from "@sp24/common/util/EventEmitter.js"
import type {IServerToServerTransport} from "./IServerToServerTransport.js";
import {IServerToClientTransport} from "./IServerToClientTransport.js";
import {webcrypto} from "node:crypto";

// Defines an entry point for new connections to a server.
export interface IServerEntryPoint {
    readonly signKey: webcrypto.CryptoKey;
    readonly verifyKey: webcrypto.CryptoKey;
    readonly address: string;

    onClientConnect: EventEmitter<IServerToClientTransport>;
    onServerConnect: EventEmitter<IServerToServerTransport>;
}