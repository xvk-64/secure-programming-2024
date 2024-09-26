import {IServerToClientTransport} from "./IServerToClientTransport.js";
import {
    calculateFingerprint,
    ClientSendable,
    ClientSendableSignedData,
    HelloData,
    ServerToClientSendable,
    SignedData
} from "@sp24/common/messageTypes.js";
import {EventEmitter} from "@sp24/common/util/EventEmitter.js";
import {encode} from "base64-arraybuffer";
import {webcrypto} from "node:crypto";
import {IServerEntryPoint} from "./IServerEntryPoint.js";

// A server-side view of a client connected to it.
export class ConnectedClient {
    private _transport: IServerToClientTransport;

    public readonly entryPoint: IServerEntryPoint;

    public async sendMessage(message: ServerToClientSendable): Promise<void> {
        return await this._transport.sendMessage(message);
    }
    public readonly onMessageReady: EventEmitter<ClientSendable> = new EventEmitter<ClientSendable>();
    public readonly onDisconnect: EventEmitter<void> = new EventEmitter<void>();

    private _counter: number | undefined;

    private _signPublicKey: webcrypto.CryptoKey | undefined;
    public get signPublicKey(): webcrypto.CryptoKey | undefined {
        return this._signPublicKey;
    }

    private _fingerprint: string | undefined;
    public get fingerprint() {
        return this._fingerprint;
    }

    public constructor(transport: IServerToClientTransport, entryPoint: IServerEntryPoint) {
        this._transport = transport;
        this.entryPoint = entryPoint;

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
                    this._fingerprint = await calculateFingerprint(this._signPublicKey);
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