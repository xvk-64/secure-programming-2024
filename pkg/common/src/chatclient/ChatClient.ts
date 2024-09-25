import {
    ClientSendableMessageData, HelloData,
    OAEPGenParams, OAEPImportParams,
    PSSImportParams,
    ServerToClientSendable,
    SignedData
} from "../messageTypes.js";
import {IChatClientTransport} from "./IChatClientTransport.js";
import {EventListener} from "../util/Event.js";

const webCrypto = globalThis.crypto.subtle;

// Class holding most functionality of the client.
export class ChatClient {
    private readonly _transport: IChatClientTransport;

    private readonly _signPubKey: CryptoKey;
    private readonly _signPrivKey: CryptoKey;
    private readonly _cryptoPubKey: CryptoKey;
    private readonly _cryptoPrivKey: CryptoKey;
    private _counter: number = 0;

    private _receiveListener: EventListener<ServerToClientSendable>;
    private onReceiveMessage(message: ServerToClientSendable) {

    }

    private async sendSignedData<TData extends ClientSendableMessageData>(data: TData): Promise<void> {
        const message = await SignedData.create<TData>(data, this._counter++, this._signPrivKey);
        await this._transport.sendMessage(message);
    }

    private constructor(
        transport: IChatClientTransport,
        signPubKey: CryptoKey,
        signPrivKey: CryptoKey,
        cryptoPubKey: CryptoKey,
        cryptoPrivKey: CryptoKey
    ) {
        this._transport = transport;
        this._receiveListener = this._transport.onReceiveMessage.createListener(this.onReceiveMessage);

        this._signPubKey = signPubKey;
        this._signPrivKey = signPrivKey;
        this._cryptoPubKey = cryptoPubKey;
        this._cryptoPrivKey = cryptoPrivKey;
    }

    static async create(transport: IChatClientTransport): Promise<ChatClient> {
        // Generate keys
        const {privateKey, publicKey} = await webCrypto.generateKey(OAEPGenParams, true, ["encrypt", "decrypt"]);
        // Hack to get the same RSA key into both OAEP and PSS
        const exportedPub = await webCrypto.exportKey("spki", publicKey);
        const exportedPriv = await webCrypto.exportKey("pkcs8", privateKey);

        const signPub = await webCrypto.importKey("spki", exportedPub, PSSImportParams, true, ["verify"]);
        const signPriv = await webCrypto.importKey("pkcs8", exportedPriv, PSSImportParams, false, ["sign"]);
        const cryptoPub = await webCrypto.importKey("spki", exportedPub, OAEPImportParams, true, ["encrypt"]);
        const cryptoPriv = await webCrypto.importKey("pkcs8", exportedPriv, OAEPImportParams, false, ["decrypt"]);

        let client = new ChatClient(transport, signPub, signPriv, cryptoPub, cryptoPriv);

        await transport.connect();

        // Say hello
        await client.sendSignedData(new HelloData(cryptoPub));

        return client;
    }
}