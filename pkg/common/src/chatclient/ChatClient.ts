import {
    ChatData, CleartextChat, ClientList,
    ClientSendableSignedData, ClientSendableSignedDataEntry,
    HelloData,
    PublicChatData,
    ServerToClientSendable, ServerToClientSendableSignedData,
    SignedData
} from "../messageTypes.js";
import {IChatClientTransport} from "./IChatClientTransport.js";
import {EventListener, EventEmitter} from "../util/EventEmitter.js";
import {OtherClient} from "./OtherClient.js";
import {calculateFingerprint, OAEPGenParams, OAEPImportParams, PSSImportParams} from "../util/crypto.js";

const webCrypto = globalThis.crypto.subtle;

const GroupIDLength = 32;
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

    private _otherClients: { [fingerprint: string]: OtherClient } = {};

    private _groups: { [groupID: string]: string[]} = {}

    public getGroupID(recipientFingerprints: string[]): string {
        let sorted = recipientFingerprints.slice().sort();

        let result = ""

        for (let i = 0; i < GroupIDLength; i++) {
            result += sorted[i % sorted.length][i];
        }

        this._groups[result] = sorted;

        return result;
    }

    private _receiveListener: EventListener<ServerToClientSendable>;
    private async onReceiveMessage(message: ServerToClientSendable) {
        switch (message.type) {
            case "client_list":
                // console.log(message);

                // Client list from the server
                let clientListMessage = message as ClientList;

                for (const server of clientListMessage.servers) {
                    for (const verifyKey of server.clientVerifyKeys) {
                        const fingerprint = await calculateFingerprint(verifyKey);

                        if (fingerprint in this._otherClients) {
                            // TODO set online status?
                        } else {
                            this._otherClients[fingerprint] = await OtherClient.create(server.address, verifyKey, 0);
                        }
                    }
                }
                break;
            case "signed_data":
                // Signed data from another client

                // Ugly code ahead

                // Locate the sender
                let otherClient: OtherClient | undefined;

                for (const fingerprint in this._otherClients) {
                    let client = this._otherClients[fingerprint];

                    if (await client.isValidSignedData(message)) {
                        otherClient = client;
                        break;
                    }
                }

                if (otherClient === undefined)
                    // Not valid signed data for any client we know about.
                    return;

                switch (message.data.type) {
                    case "chat":
                        let chatMessage = message as SignedData<ChatData>;

                        let cleartext = await otherClient.isValidChat(chatMessage, this.fingerprint, this._decryptKey);

                        if (cleartext === undefined)
                            // Bad chat message
                            return;

                        if (cleartext.senderFingerprint === this.fingerprint)
                            // Don't care about message from myself.
                            return;

                        const otherParticipants = [cleartext.senderFingerprint, ...cleartext.recipientFingerprints].filter(fingerprint => fingerprint != this.fingerprint);

                        // Do something with the cleartext.
                        await this.onChat.dispatch({
                            message: cleartext.message,
                            groupID: this.getGroupID(otherParticipants),
                            senderFingerprint: cleartext.senderFingerprint,
                        })
                        break;
                    case "public_chat":
                        let publicChatMessage = message as SignedData<PublicChatData>;

                        if (!otherClient.isValidPublicChat(publicChatMessage))
                            // Bad public chat message
                            return;

                        if (publicChatMessage.data.senderFingerprint === this.fingerprint)
                            // Don't care about messages from me
                            return;

                        // Do something with public chat.
                        await this.onPublicChat.dispatch({
                            message: publicChatMessage.data.message,
                            senderFingerprint: publicChatMessage.data.senderFingerprint
                        });
                        break;
                }
                break;
        }
    }

    private async sendSignedData(data: ClientSendableSignedDataEntry): Promise<void> {
        const message = await SignedData.create(data, this._counter++, this._signKey);
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
        this._receiveListener = this._transport.onReceiveMessage.createAsyncListener(message => this.onReceiveMessage(message));

        this._verifyKey = verifyKey;
        this._signKey = signKey;
        this._encryptKey = encryptKey;
        this._decryptKey = decryptKey;
        this.fingerprint = fingerprint
    }

    public readonly onChat: EventEmitter<Chat> = new EventEmitter();
    public async sendChat(message: string, groupID: string): Promise<void> {
        if (this._groups[groupID] === undefined)
            // Bad groupID
            return;

        let recipientFingerprints = this._groups[groupID];

        let destinationServers: string[] = [];
        let recipientEncryptKeys: CryptoKey[] = [];

        for (const fingerprint in this._otherClients) {
            if (!recipientFingerprints.includes(fingerprint))
                continue;

            const client = this._otherClients[fingerprint];

            if (!destinationServers.includes(client.serverAddress))
                destinationServers.push(client.serverAddress);

            recipientEncryptKeys.push(client.encryptKey);
        }

        if (destinationServers.length === 0)
            // No destination servers
            return;

        if (recipientEncryptKeys.length === 0)
            // No recipients
            return;

        const chatData = await ChatData.create(message, this.fingerprint, recipientEncryptKeys, destinationServers);

        await this.sendSignedData(chatData);
    }

    public readonly onPublicChat: EventEmitter<PublicChat> = new EventEmitter();
    public async sendPublicChat(message: string): Promise<void> {
        const publicChatData = new PublicChatData(this.fingerprint, message);

        await this.sendSignedData(publicChatData);
    }

    static async create(transport: IChatClientTransport, privateKey: CryptoKey, publicKey: CryptoKey): Promise<ChatClient> {
        // Hack to get the same RSA key into both OAEP and PSS
        const exportedPub = await webCrypto.exportKey("spki", publicKey);
        const exportedPriv = await webCrypto.exportKey("pkcs8", privateKey);

        const verifyKey = await webCrypto.importKey("spki", exportedPub, PSSImportParams, true, ["verify"]);
        const signKey = await webCrypto.importKey("pkcs8", exportedPriv, PSSImportParams, false, ["sign"]);
        const encryptKey = await webCrypto.importKey("spki", exportedPub, OAEPImportParams, true, ["encrypt"]);
        const decryptKey = await webCrypto.importKey("pkcs8", exportedPriv, OAEPImportParams, false, ["decrypt"]);

        const fingerprint = await calculateFingerprint(verifyKey);

        let client = new ChatClient(transport, verifyKey, signKey, encryptKey, decryptKey, fingerprint);

        // Say hello
        await client.sendSignedData(new HelloData(verifyKey));

        return client;
    }
}