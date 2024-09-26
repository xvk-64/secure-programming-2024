import type {IServerToClientTransport} from "../IServerToClientTransport.js";
import type {TestClientTransport} from "./TestClientTransport.js";
import {ClientSendable, ServerToClientSendable} from "@sp24/common/messageTypes.js";
import {Event} from "@sp24/common/util/Event.js"

export class ServerToTestClientTransport implements IServerToClientTransport {
    private _testClientTransport: TestClientTransport;

    onDisconnect: Event<void> = new Event<void>();
    onReceiveMessage: Event<ClientSendable> = new Event<ClientSendable>();

    public readonly identifier = "Test Client";

    sendMessage(message: ServerToClientSendable): Promise<void> {
        this._testClientTransport.onReceiveMessage.dispatch(message);

        return Promise.resolve();
    }

    public constructor(testClientTransport: TestClientTransport) {
        this._testClientTransport = testClientTransport;
        testClientTransport.onSendMessage.createListener((message: ClientSendable) => this.onReceiveMessage.dispatch(message));
    }
}