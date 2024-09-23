import  {type Protocol} from "protocol/messageTypes.js"
import {decode, encode} from "base64-arraybuffer";

const webCrypto = globalThis.crypto.subtle;

export const OAEPGenParams: RsaHashedKeyGenParams = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1,0,1]),
    hash: "SHA-256"
}
export const OAEPImportParams: RsaHashedImportParams = {
    name: "RSA-OAEP",
    hash: "SHA-256"
}
export const PSSGenParams: RsaHashedKeyGenParams = {
    name: "RSA-PSS",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1,0,1]),
    hash: "SHA-256"
}
export const PSSImportParams: RsaHashedImportParams = {
    name: "RSA-PSS",
    hash: "SHA-256"
}

/// These are typings that are more friendly for client/server development in our environment.
/// They use special objects that aren't directly synthesisable to JSON. (Crypto, ArrayBuffer...)

interface IMessage<TProtocolMessage extends Protocol.ProtocolMessage> {
    type: string;
    toProtocol(): Promise<TProtocolMessage>;
}
interface IMessageData<TData extends Protocol.SignedDataEntry> {
    type: string;
    toProtocol(): Promise<TData>;
}

export class HelloData implements IMessageData<Protocol.HelloData> {
    type: "hello" = "hello"
    signPublicKey: CryptoKey;

    public constructor(signPublicKey: CryptoKey) {
        this.signPublicKey = signPublicKey;
    }

    async toProtocol(): Promise<Protocol.HelloData> {
        // Export public key.
        const exported: ArrayBuffer = await webCrypto.exportKey("spki", this.signPublicKey);
        const exportedPEM = `-----BEGIN PUBLIC KEY-----\n${encode(exported)}\n-----END PUBLIC KEY-----`;

        return {
            type: "hello",
            public_key: exportedPEM,
        }
    }
    static async fromProtocol(protocolData: Protocol.HelloData): Promise<HelloData> {
        // Import the key from the PEM
        const pem = protocolData.public_key;

        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        const pemContents = pem.substring(
            pemHeader.length,
            pem.length - pemFooter.length - 1,
        );

        const spki = decode(pemContents);

        return new HelloData(await webCrypto.importKey("spki", spki, PSSImportParams, true, ["verify"]));
    }
}
export class SignedData<TData extends IMessageData<Protocol.SignedDataEntry>> implements IMessage<Protocol.SignedData> {
    type: "signed_data" = "signed_data";
    data: TData;
    counter: number;
    signature: ArrayBuffer;

    private constructor(data: TData, counter: number, signature: ArrayBuffer) {
        this.data = data;
        this.counter = counter;
        this.signature = signature;
    }

    static async create<TData extends IMessageData<Protocol.SignedDataEntry>>
        (data: TData, counter: number, privateKey: CryptoKey): Promise<SignedData<TData>> {
        // Generate signature.
        const payloadString = JSON.stringify(await data.toProtocol()) + counter.toString();
        const encodedPayload = new TextEncoder().encode(payloadString);
        const signParams: RsaPssParams = {
            name: "RSA-PSS",
            saltLength: 32
        }
        const signature = await webCrypto.sign(signParams, privateKey, encodedPayload);

        return new SignedData(data, counter, signature);
    }

    async toProtocol(): Promise<Protocol.SignedData> {
        return {
            type: "signed_data",
            data: await this.data.toProtocol(),
            counter: this.counter,
            signature: encode(this.signature)
        };
    }
    static async fromProtocol(protocolMessage: Protocol.SignedData): Promise<SignedData<IMessageData<Protocol.SignedDataEntry>> | undefined> {
        let data: IMessageData<Protocol.SignedDataEntry> | undefined;

        switch(protocolMessage.data.type) {
            case "hello":
                data = await HelloData.fromProtocol(protocolMessage.data as Protocol.HelloData);
                break;
        }

        if (data == undefined)
            // Error
            return undefined;

        return new SignedData(data, protocolMessage.counter, decode(protocolMessage.signature));
    }
}

// Which message types is a client allowed to send?
type ClientSendableData = Protocol.HelloData;
export type ClientSendableMessageData = IMessageData<Protocol.HelloData>;
export type ClientSendable = SignedData<ClientSendableMessageData>;

// Which message types is a server allowed to send?
export type ServerSendable = null;