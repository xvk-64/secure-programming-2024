import type {IServerEntryPoint} from "../IServerEntryPoint.js";
import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import  {TestClientTransport} from "./TestClientTransport.js";
import {ServerToTestClientTransport} from "./ServerToTestClientTransport.js";
import {ConnectedClient} from "../ConnectedClient.js";
import {ConnectedServer} from "../ConnectedServer.js";
import {ClientSendableSignedData} from "@sp24/common/messageTypes.js";
import {webcrypto} from "node:crypto";
import {calculateFingerprint} from "@sp24/common/util/crypto.js";

export class TestClientEntryPoint implements IServerEntryPoint {
    onClientConnect: EventEmitter<ConnectedClient> = new EventEmitter();
    onServerConnect: EventEmitter<ConnectedServer> = new EventEmitter();

    readonly address: string;
    readonly signKey: webcrypto.CryptoKey;
    readonly verifyKey: webcrypto.CryptoKey;

    public constructor(address: string, signKey: webcrypto.CryptoKey, verifyKey: webcrypto.CryptoKey) {
        this.address = address;
        this.signKey = signKey;
        this.verifyKey = verifyKey;
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

                    connectedTestClient.onReceiveMessage.removeListener(messageListener);

                    const client = new ConnectedClient(connectedTestClient, this, signedDataMessage.data.verifyKey, await calculateFingerprint(signedDataMessage.data.verifyKey), signedDataMessage.counter);

                    this.onClientConnect.dispatch(client);
                }
            }
        });
    }
}