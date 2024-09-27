import {IServerToServerTransport} from "./IServerToServerTransport.js";
import {IServerEntryPoint} from "./IServerEntryPoint.js";
import {
    ClientSendable, ServerHelloData,
    ServerToClientSendable,
    ServerToServerSendable,
    ServerToServerSendableSignedData, SignedData
} from "@sp24/common/messageTypes.js";
import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import {webcrypto} from "node:crypto";
import {IServerToClientTransport} from "./IServerToClientTransport.js";
import {NeighbourhoodAllowList, NeighbourhoodServer} from "./NeighbourhoodAllowList.js";

export type NeighbourhoodClient = {
    verifyKey: webcrypto.CryptoKey;
}

// Server-side view of another server in the neighbourhood.
export class ConnectedServer {
    private _transport: IServerToServerTransport;

    private _clients: NeighbourhoodClient[] = [];
    public get clients(): NeighbourhoodClient[] {
        return this._clients;
    }

    private _neighbourhoodEntry: NeighbourhoodServer | undefined;
    public get neighbourhoodEntry() {
        return this._neighbourhoodEntry;
    }

    private _counter: number | undefined;

    public readonly entryPoint: IServerEntryPoint;

    public async sendMessage(message: ServerToServerSendable): Promise<void> {
        return await this._transport.sendMessage(message);
    }

    public readonly onMessageReady: EventEmitter<ServerToServerSendable> = new EventEmitter();
    public readonly onDisconnect: EventEmitter<void> = new EventEmitter();

    public constructor(transport: IServerToServerTransport, entryPoint: IServerEntryPoint, neighbourhood: NeighbourhoodAllowList) {
        this._transport = transport;
        this.entryPoint = entryPoint;

        const messageListener = this._transport.onReceiveMessage.createListener(async message => {
            // Validate signed data
            if (message.type == "signed_data") {
                const signedDataMessage = message as ServerToServerSendableSignedData;

                // See if this was sent by the server?
                if (signedDataMessage.data.type == "server_hello") {
                    const serverHelloMessage = message as SignedData<ServerHelloData>;

                    if (this._counter !== undefined && serverHelloMessage.counter <= this._counter)
                        // Invalid counter.
                        return;

                    // Locate this server in the neighbourhood allow list
                    let tryEntry = neighbourhood.find(server => server.address == serverHelloMessage.data.serverAddress);

                    if (tryEntry === undefined)
                        // Not in neighbourhood allow list
                        return;

                    let entry = tryEntry as NeighbourhoodServer;

                    if (!await serverHelloMessage.verify(entry.verifyKey))
                        // Invalid signature
                        return;

                    this._counter = serverHelloMessage.counter;
                    this._neighbourhoodEntry = entry;
                }
            }
            if (message.type == "client_update") {
                // Update my clients

            }

            // Forward the message upwards
            this.onMessageReady.dispatch(message);
        });

        this._transport.onDisconnect.createListener(() => {
            this._transport.onReceiveMessage.removeListener(messageListener);
            this.onDisconnect.dispatch();
        })
    }
}