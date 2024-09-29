import {EventEmitter} from "@sp24/common/util/EventEmitter.js"
import type {TestEntryPoint} from "./TestEntryPoint.js";
import {IChatClientTransport} from "@sp24/common/chatclient/IChatClientTransport.js";
import {ClientSendable, ServerToClientSendable} from "@sp24/common/messageTypes.js";

// Transport layer for testing client implementation on the server side.
export class TestClientTransport implements IChatClientTransport {
    readonly onReceiveMessage: EventEmitter<ServerToClientSendable> = new EventEmitter();

    private _serverEntryPoint: TestEntryPoint

    connect(): Promise<void> {
        this._serverEntryPoint.addClient(this);

        return Promise.resolve();
    }

    readonly onSendMessage: EventEmitter<ClientSendable> = new EventEmitter();
    async sendMessage(message: ClientSendable): Promise<void> {
        await this.onSendMessage.dispatch(message);
    }

    readonly onDisconnect: EventEmitter<void> = new EventEmitter();

    constructor(entryPoint: TestEntryPoint) {
        this._serverEntryPoint = entryPoint;
    }
}