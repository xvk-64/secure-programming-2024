import {EventEmitter} from "@sp24/common/util/EventEmitter.js"
import type {TestClientEntryPoint} from "./TestClientEntryPoint.js";
import {IChatClientTransport} from "@sp24/common/chatclient/IChatClientTransport.js";
import {ClientSendable, ServerToClientSendable} from "@sp24/common/messageTypes.js";

// Transport layer for testing client implementation on the server side.
export class TestClientTransport implements IChatClientTransport {
    readonly onReceiveMessage: EventEmitter<ServerToClientSendable> = new EventEmitter<ServerToClientSendable>();

    private _serverEntryPoint: TestClientEntryPoint

    connect(): Promise<void> {
        this._serverEntryPoint.addClient(this);

        return Promise.resolve();
    }

    readonly onSendMessage: EventEmitter<ClientSendable> = new EventEmitter<ClientSendable>();
    sendMessage(message: ClientSendable): Promise<void> {
        this.onSendMessage.dispatch(message);
        return Promise.resolve();
    }

    constructor(entryPoint: TestClientEntryPoint) {
        this._serverEntryPoint = entryPoint;
    }
}