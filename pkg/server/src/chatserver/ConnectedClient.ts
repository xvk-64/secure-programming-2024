import {IServerToClientTransport} from "./IServerToClientTransport.js";
import {
    ClientSendable,
    ClientSendableSignedData,
    HelloData,
    ServerToClientSendable,
    SignedData
} from "@sp24/common/messageTypes.js";
import {Event} from "@sp24/common/util/Event.js";
import {encode} from "base64-arraybuffer";
import {sign, webcrypto} from "node:crypto";

// A server-side view of a client connected to it.
export class ConnectedClient {
    private _transport: IServerToClientTransport;

    public async sendMessage(message: ServerToClientSendable): Promise<void> {
        return await this._transport.sendMessage(message);
    }
    public readonly onMessageReady: Event<ClientSendable> = new Event<ClientSendable>();
    public readonly onDisconnect: Event<void> = new Event<void>();

    private _counter: number | undefined;

    private _signPublicKey: webcrypto.CryptoKey | undefined;
    private _fingerprint: string | undefined;
    public get fingerprint() {
        return this._fingerprint;
    }

    public constructor(transport: IServerToClientTransport) {
        this._transport = transport;

        const receiveListener = this._transport.onReceiveMessage.createListener(async message => {
            // Validate signed data.
            if (message.type == "signed_data") {
                const signedDataMessage = message as ClientSendableSignedData;
                if (this._counter !== undefined && signedDataMessage.counter <= this._counter)
                    // Invalid counter value.
                    return;

                // Process hello message, update key...
                if (signedDataMessage.data.type == "hello") {
                    const helloData = signedDataMessage.data as HelloData;

                    if (!await signedDataMessage.verify(helloData.signPublicKey))
                        // Invalid signature.
                        return;

                    // Update key
                    this._signPublicKey = helloData.signPublicKey;

                    // Update fingerprint
                    let protocolData = await helloData.toProtocol();
                    let exportedKeyBuffer = new TextEncoder().encode(protocolData.public_key);
                    let fingerprintBuffer = await crypto.subtle.digest("SHA-256", exportedKeyBuffer);
                    this._fingerprint = encode(fingerprintBuffer);
                }

                if (this._signPublicKey === undefined)
                    // Need a key to send signed data.
                    return;

                if (!await signedDataMessage.verify(this._signPublicKey))
                    // Invalid signature.
                    return;

                // Update counter
                this._counter = signedDataMessage.counter;
            }

            // Message is all valid, pass upwards.
            this.onMessageReady.dispatch(message);
        });

        this._transport.onDisconnect.createListener(() => {
            this._transport.onReceiveMessage.removeListener(receiveListener);
            this.onDisconnect.dispatch();
        }, true);
    }
}