import type {IServerEntryPoint} from "../IServerEntryPoint.js";
import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import type {IServerToClientTransport} from "../IServerToClientTransport.js";
import type {IServerToServerTransport} from "../IServerToServerTransport.js";
import  {TestClientTransport} from "./TestClientTransport.js";
import {ServerToTestClientTransport} from "./ServerToTestClientTransport.js";

export class TestClientEntryPoint implements IServerEntryPoint {
    onClientConnect: EventEmitter<IServerToClientTransport> = new EventEmitter<IServerToClientTransport>();
    onServerConnect: EventEmitter<IServerToServerTransport> = new EventEmitter<IServerToServerTransport>();

    addClient(clientTransport: TestClientTransport) {
        let connectedTestClient = new ServerToTestClientTransport(clientTransport);

        this.onClientConnect.dispatch(connectedTestClient);
    }
}