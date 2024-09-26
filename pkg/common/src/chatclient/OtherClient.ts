import {
    calculateFingerprint, ChatData, CleartextChat,
    ClientToClientSendable,
    OAEPImportParams,
    PSSImportParams,
    PublicChatData, SignedData
} from "../messageTypes.js";

const webCrypto = globalThis.crypto.subtle;

// Represents a client's view of other clients in the network
export class OtherClient {
    public readonly fingerprint: string;
    public readonly serverAddress: string;
    private readonly _verifyKey: CryptoKey;
    private readonly _encryptKey: CryptoKey;

    private _counter: number;

    private constructor(fingerprint: string, serverAddress: string, verifyKey: CryptoKey, encryptKey: CryptoKey, counter: number) {
        this.fingerprint = fingerprint;
        this.serverAddress = serverAddress;
        this._verifyKey = verifyKey;
        this._encryptKey = encryptKey;
        this._counter = counter;
    }

    public async isValidSignedData(message: ClientToClientSendable): Promise<boolean> {
        if (message.counter <= this._counter)
            // Invalid counter.
            return false;

        if (!await message.verify(this._verifyKey))
            // Invalid signature.
            return false;

        this._counter = message.counter;

        return true;
    }

    public isValidPublicChat(message: SignedData<PublicChatData>) {
        if (message.data.senderFingerprint !== this.fingerprint)
            // Invalid sender fingerprint
            return false;

        return true;
    }

    public async isValidChat(message: SignedData<ChatData>, recipientFingerprint: string, recipientDecryptKey: CryptoKey): Promise<CleartextChat | undefined> {
        const tryDecrypt = await message.data.tryDecrypt(recipientFingerprint, recipientDecryptKey);

        if (tryDecrypt === undefined)
            // Not intended recipient
            return undefined;

        const decrypted = tryDecrypt as CleartextChat;

        if (decrypted.senderFingerprint !== this.fingerprint)
            // Invalid sender fingerprint
            return undefined;

        return decrypted;
    }

    static async create(serverAddress: string, verifyKey: CryptoKey, counter: number) {
        const fingerprint = await calculateFingerprint(verifyKey);

        // Hack to get the same RSA key into both OAEP and PSS
        const exportedPub = await webCrypto.exportKey("spki", verifyKey);
        const verify = await webCrypto.importKey("spki", exportedPub, PSSImportParams, true, ["verify"]);
        const encrypt = await webCrypto.importKey("spki", exportedPub, OAEPImportParams, true, ["encrypt"]);

        return new OtherClient(fingerprint, serverAddress, verify, encrypt, counter);
    }
}