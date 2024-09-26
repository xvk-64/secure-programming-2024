import {
    calculateFingerprint,
    ChatData, CleartextChat, ClientList,
    ClientSendableSignedData, ClientSendableSignedDataEntry,
    HelloData,
    OAEPGenParams, OAEPImportParams,
    PSSImportParams, PublicChatData,
    ServerToClientSendable, ServerToClientSendableSignedData,
    SignedData
} from "../messageTypes.js";
import {IChatClientTransport} from "./IChatClientTransport.js";
import {EventListener, EventEmitter} from "../util/EventEmitter.js";
import {OtherClient} from "./OtherClient.js";

const webCrypto = globalThis.crypto.subtle;

export type Chat = {
    message: string;
    groupID: string;
    senderFingerprint: string;
}
export type PublicChat = {
    message: string;
    senderFingerprint: string;
}

// Class holding most functionality of the client.
export class ChatClient {
    private readonly _transport: IChatClientTransport;

    private readonly _verifyKey: CryptoKey;
    private readonly _signKey: CryptoKey;
    private readonly _encryptKey: CryptoKey;
    private readonly _decryptKey: CryptoKey;
    private _counter: number = 0;
    public readonly fingerprint: string;

    private otherClients: { [fingerprint: string] : OtherClient } = {};

    private _receiveListener: EventListener<ServerToClientSendable>;
    private async onReceiveMessage(message: ServerToClientSendable) {
        switch (message.type) {
            case "client_list":
                // Client list from the server
                let clientListMessage = message as ClientList;

                for (const server of clientListMessage.servers) {
                    for (const verifyKey of server.clientVerifyKeys) {
                        const fingerprint = await calculateFingerprint(verifyKey);

                        if (fingerprint in this.otherClients) {
                            // TODO set online status?
                        } else {
                            this.otherClients[fingerprint] = await OtherClient.create(server.address, verifyKey, 0);
                        }
                    }
                }
                break;
            case "signed_data":
                // Signed data from another client
                let signedDataMessage = message as ServerToClientSendableSignedData;

                // Ugly code ahead

                // Locate the sender
                let otherClient: OtherClient | undefined;

                for (const fingerprint in this.otherClients) {
                    let client = this.otherClients[fingerprint];

                    if (await client.isValidSignedData(signedDataMessage)) {
                        otherClient = client;
                        break;
                    }
                }

                if (otherClient === undefined)
                    // Not valid signed data for any client we know about.
                    return;

                switch (signedDataMessage.data.type) {
                    case "chat":
                        let chatMessage = message as SignedData<ChatData>;

                        let tryCleartext = await otherClient.isValidChat(chatMessage, this.fingerprint, this._decryptKey);

                        if (tryCleartext === undefined)
                            // Bad chat message
                            return;

                        let cleartext = tryCleartext as CleartextChat;

                        // Do something with the cleartext.
                        this.onChat.dispatch({
                            message: cleartext.message,
                            groupID: "", // TODO
                            senderFingerprint: cleartext.senderFingerprint,
                        })
                        break;
                    case "public_chat":
                        let publicChatMessage = message as SignedData<PublicChatData>;

                        if (!otherClient.isValidPublicChat(publicChatMessage))
                            // Bad public chat message
                            return;

                        // Do something with public chat.
                        this.onPublicChat.dispatch({
                            message: publicChatMessage.data.message,
                            senderFingerprint: publicChatMessage.data.senderFingerprint
                        });
                        break;
                }
                break;
        }
    }

    private async sendSignedData<TData extends ClientSendableSignedDataEntry>(data: TData): Promise<void> {
        const message = await SignedData.create<TData>(data, this._counter++, this._signKey);
        await this._transport.sendMessage(message);
    }

    private constructor(
        transport: IChatClientTransport,
        verifyKey: CryptoKey,
        signKey: CryptoKey,
        encryptKey: CryptoKey,
        decryptKey: CryptoKey,
        fingerprint: string
    ) {
        this._transport = transport;
        this._receiveListener = this._transport.onReceiveMessage.createListener(message => this.onReceiveMessage(message));

        this._verifyKey = verifyKey;
        this._signKey = signKey;
        this._encryptKey = encryptKey;
        this._decryptKey = decryptKey;
        this.fingerprint = fingerprint
    }

    public readonly onChat: EventEmitter<Chat> = new EventEmitter();
    public async sendChat(message: string, groupID: string): Promise<void> {
        // TODO
    }

    public readonly onPublicChat: EventEmitter<PublicChat> = new EventEmitter();
    public async sendPublicChat(message: string): Promise<void> {
        const publicChatData = new PublicChatData(this.fingerprint, message);

        await this.sendSignedData(publicChatData);
    }

    static async create(transport: IChatClientTransport): Promise<ChatClient> {
        // Generate keys
        const {privateKey, publicKey} = await webCrypto.generateKey(OAEPGenParams, true, ["encrypt", "decrypt"]);
        // Hack to get the same RSA key into both OAEP and PSS
        const exportedPub = await webCrypto.exportKey("spki", publicKey);
        const exportedPriv = await webCrypto.exportKey("pkcs8", privateKey);

        const verifyKey = await webCrypto.importKey("spki", exportedPub, PSSImportParams, true, ["verify"]);
        const signKey = await webCrypto.importKey("pkcs8", exportedPriv, PSSImportParams, false, ["sign"]);
        const encryptKey = await webCrypto.importKey("spki", exportedPub, OAEPImportParams, true, ["encrypt"]);
        const decryptKey = await webCrypto.importKey("pkcs8", exportedPriv, OAEPImportParams, false, ["decrypt"]);

        const fingerprint = await calculateFingerprint(verifyKey);

        let client = new ChatClient(transport, verifyKey, signKey, encryptKey, decryptKey, fingerprint);

        await transport.connect();

        // Say hello
        await client.sendSignedData(new HelloData(verifyKey));

        return client;
    }
}