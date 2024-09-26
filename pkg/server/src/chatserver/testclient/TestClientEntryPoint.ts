import type {IServerEntryPoint} from "../IServerEntryPoint.js";
import {Event} from "@sp24/common/util/Event.js";
import type {IServerToClientTransport} from "../IServerToClientTransport.js";
import type {IServerToServerTransport} from "../IServerToServerTransport.js";
import type {TestClientTransport} from "./TestClientTransport.js";
import {ServerToTestClientTransport} from "./ServerToTestClientTransport.js";

export class TestClientEntryPoint implements IServerEntryPoint {
    onClientConnect: Event<IServerToClientTransport> = new Event<IServerToClientTransport>();
    onServerConnect: Event<IServerToServerTransport> = new Event<IServerToServerTransport>();

    addClient(clientTransport: TestClientTransport) {
        let connectedTestClient = new ServerToTestClientTransport(clientTransport);

        this.onClientConnect.dispatch(connectedTestClient);
    }
}