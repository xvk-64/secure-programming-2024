import type {IServerEntryPoint} from "../IServerEntryPoint.js";
import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import  {TestClientTransport} from "./TestClientTransport.js";
import {ServerToTestClientTransport} from "./ServerToTestClientTransport.js";
import {ConnectedClient} from "../ConnectedClient.js";
import {ConnectedServer} from "../ConnectedServer.js";
import {
    ClientSendableSignedData,
    ServerHelloData,
    ServerToServerSendableSignedData,
    SignedData
} from "@sp24/common/messageTypes.js";
import {webcrypto} from "node:crypto";
import {calculateFingerprint} from "@sp24/common/util/crypto.js";
import {NeighbourhoodAllowList, NeighbourhoodServer} from "../NeighbourhoodAllowList.js";
import {TestServerToServerTransport} from "./TestServerToServerTransport.js";
import {IServerToServerTransport} from "../IServerToServerTransport.js";

export class TestEntryPoint implements IServerEntryPoint {
    onClientConnect: EventEmitter<ConnectedClient> = new EventEmitter();
    onServerConnect: EventEmitter<ConnectedServer> = new EventEmitter();

    private _neighbourhood: NeighbourhoodAllowList;

    public constructor(neighbourhood: NeighbourhoodAllowList) {
        this._neighbourhood = neighbourhood;
    }

    addClient(clientTransport: TestClientTransport) {
        let connectedTestClient = new ServerToTestClientTransport(clientTransport);

        // Wait until hello message
        const messageListener = connectedTestClient.onReceiveMessage.createListener(async message => {
            if (message.type === "signed_data") {
                const signedDataMessage = message as ClientSendableSignedData;

                if (signedDataMessage.data.type === "hello") {
                    if (!await signedDataMessage.verify(signedDataMessage.data.verifyKey))
                        // Invalid signature
                        return;

                    // Remove listener as we have received the message we want.
                    connectedTestClient.onReceiveMessage.removeListener(messageListener);

                    const client = new ConnectedClient(connectedTestClient, this, signedDataMessage.data.verifyKey, await calculateFingerprint(signedDataMessage.data.verifyKey), signedDataMessage.counter);

                    await this.onClientConnect.dispatch(client);
                }
            }
        });
    }

    async connectToServer(serverTransport: IServerToServerTransport, helloMessage: SignedData<ServerHelloData>) {
        // Wait for a hello message
        const messageListener = serverTransport.onReceiveMessage.createAsyncListener(async message => {
            if (message.type === "signed_data") {
                if (message.data.type == "server_hello") {
                    const serverHelloMessage = message as SignedData<ServerHelloData>;

                    // Locate this server in the neighbourhood allow list
                    let entry = this._neighbourhood.find(server => server.address === serverHelloMessage.data.serverAddress);

                    if (entry === undefined)
                        // Not in neighbourhood allow list
                        return;

                    if (!await serverHelloMessage.verify(entry.verifyKey))
                        // Invalid signature
                        return;

                    // Remove listener as we have received the message we want.
                    serverTransport.onReceiveMessage.removeListener(messageListener);

                    const connectedServer = new ConnectedServer(serverTransport, this, entry, message.counter);

                    await this.onServerConnect.dispatch(connectedServer);
                }
            }
        });

        // Send a hello message
        await serverTransport.sendMessage(helloMessage);
    }
}