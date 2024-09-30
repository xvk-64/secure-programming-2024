import type {IServerToClientTransport} from "../IServerToClientTransport.js";
import type {TestClientTransport} from "./TestClientTransport.js";
import {ClientSendable, ServerToClientSendable} from "@sp24/common/messageTypes.js";
import {EventEmitter} from "@sp24/common/util/EventEmitter.js"

export class ServerToTestClientTransport implements IServerToClientTransport {
    private _testClientTransport: TestClientTransport;

    onDisconnect: EventEmitter<void> = new EventEmitter<void>();
    onReceiveMessage: EventEmitter<ClientSendable> = new EventEmitter<ClientSendable>();

    async sendMessage(message: ServerToClientSendable): Promise<void> {
        await this._testClientTransport.onReceiveMessage.dispatch(message);

        return Promise.resolve();
    }

    public constructor(testClientTransport: TestClientTransport) {
        this._testClientTransport = testClientTransport;
        testClientTransport.onSendMessage.createAsyncListener((message: ClientSendable) => this.onReceiveMessage.dispatch(message));
    }
}