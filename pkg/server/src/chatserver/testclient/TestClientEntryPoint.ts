import type {IServerEntryPoint} from "../IServerEntryPoint.js";
import {Event} from "@sp24/common/util/Event.js";
import type {IConnectedClient} from "../IConnectedClient.js";
import type {IConnectedServer} from "../IConnectedServer.js";
import type {TestClientTransport} from "./TestClientTransport.js";
import {ConnectedTestClient} from "./ConnectedTestClient.js";

export class TestClientEntryPoint implements IServerEntryPoint {
    onClientConnect: Event<IConnectedClient> = new Event<IConnectedClient>();
    onServerConnect: Event<IConnectedServer> = new Event<IConnectedServer>();

    addClient(clientTransport: TestClientTransport) {
        let connectedTestClient = new ConnectedTestClient(clientTransport);

        this.onClientConnect.dispatch(connectedTestClient);
    }
}