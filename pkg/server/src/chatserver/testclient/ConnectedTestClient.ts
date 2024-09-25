import type {IConnectedClient} from "../IConnectedClient.js";
import {type ClientSendable, type ServerToClientSendable, Event} from "@sp24/common/src/index.js";
import type {TestClientTransport} from "./TestClientTransport.js";

export class ConnectedTestClient implements IConnectedClient {
    private _testClientTransport: TestClientTransport;

    onDisconnect: Event<void> = new Event<void>();
    onReceiveMessage: Event<ClientSendable> = new Event<ClientSendable>();

    getIdentifier() { return "Test Client"}

    sendMessage(message: ServerToClientSendable): Promise<void> {
        this._testClientTransport.onReceiveMessage.dispatch(message);

        return Promise.resolve();
    }

    public constructor(testClientTransport: TestClientTransport) {
        this._testClientTransport = testClientTransport;
        testClientTransport.onSendMessage.createListener(message => this.onReceiveMessage.dispatch(message));
    }
}