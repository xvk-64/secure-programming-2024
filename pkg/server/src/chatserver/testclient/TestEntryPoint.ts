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

export class TestEntryPoint implements IServerEntryPoint {
    onClientConnect: EventEmitter<ConnectedClient> = new EventEmitter();
    onServerConnect: EventEmitter<ConnectedServer> = new EventEmitter();

    readonly address: string;
    readonly signKey: webcrypto.CryptoKey;
    readonly verifyKey: webcrypto.CryptoKey;
    counter: number = 0;

    private _neighbourhood: NeighbourhoodAllowList;

    public constructor(address: string, signKey: webcrypto.CryptoKey, verifyKey: webcrypto.CryptoKey, neighbourhood: NeighbourhoodAllowList) {
        this.address = address;
        this.signKey = signKey;
        this.verifyKey = verifyKey;

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

    addServer(serverTransport: TestServerToServerTransport) {
        const messageListener = serverTransport.onReceiveMessage.createAsyncListener(async message => {
            if (message.type === "signed_data") {
                const signedDataMessage = message as ServerToServerSendableSignedData;

                if (signedDataMessage.data.type == "server_hello") {
                    const serverHelloMessage = message as SignedData<ServerHelloData>;

                    // Locate this server in the neighbourhood allow list
                    let tryEntry = this._neighbourhood.find(server => server.address == serverHelloMessage.data.serverAddress);

                    if (tryEntry === undefined)
                        // Not in neighbourhood allow list
                        return;

                    let entry = tryEntry as NeighbourhoodServer;

                    if (!await serverHelloMessage.verify(entry.verifyKey))
                        // Invalid signature
                        return;

                    // Remove listener as we have received the message we want.
                    serverTransport.onReceiveMessage.removeListener(messageListener);

                    const connectedServer = new ConnectedServer(serverTransport, this, entry, signedDataMessage.counter);

                    await this.onServerConnect.dispatch(connectedServer);
                }
            }
        })
    }

    async connectToServer(otherEntryPoint: TestEntryPoint) {
        const [myTransport, theirTransport] = TestServerToServerTransport.createPair();

        this.addServer(myTransport);
        otherEntryPoint.addServer(theirTransport);

        // Initiate a server_hello
        const serverHelloData = new ServerHelloData(otherEntryPoint.address);
        const serverHelloMessage = await SignedData.create(serverHelloData, this.counter++, this.signKey);
        await myTransport.sendMessage(serverHelloMessage);

        // The other server will process the hello and send one back.
    }
}