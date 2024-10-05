import  {type Protocol} from "./protocol/messageTypes.js";
import {decode, encode} from "base64-arraybuffer";
import {
    AESGenParams,
    OAEPParams,
    PEMToKey,
    PSSParams,
    keyToPEM, PSSImportParams
} from "./util/crypto.js";

const webCrypto = globalThis.crypto.subtle;



/// These are typings that are more friendly for client/server development in our environment.
/// They use special objects that aren't directly synthesisable to JSON. (Crypto, ArrayBuffer...)

abstract class MessageBase<TProtocolMessage extends Protocol.ProtocolMessage> {
    type: TProtocolMessage["type"];

    protected readonly _protocolMessage: TProtocolMessage;
    get protocol() {
        return this._protocolMessage;
    };

    protected constructor(protocolMessage: TProtocolMessage) {
        this._protocolMessage = protocolMessage;
        this.type = protocolMessage.type;
    }
}
abstract class MessageDataBase<TData extends Protocol.SignedDataEntry> {
    type: TData["type"];

    protected readonly _protocol: TData;
    get protocol() {
        return this._protocol;
    };

    protected constructor(protocolData: TData) {
        this._protocol = protocolData;
        this.type = protocolData.type;
    }

}


export class HelloData extends MessageDataBase<Protocol.HelloData> {
    readonly verifyKey: CryptoKey;

    private constructor(protocolData: Protocol.HelloData, verifyKey: CryptoKey) {
        super(protocolData);
        this.verifyKey = verifyKey;
    }

    async calculateFingerprint() {
        let exportedKeyBuffer = new TextEncoder().encode(this.protocol.public_key);
        let fingerprintBuffer = await crypto.subtle.digest("SHA-256", exportedKeyBuffer);
        return encode(fingerprintBuffer);
    }

    static async create(verifyKey: CryptoKey) {
        // Export public key
        const exportedPEM = await keyToPEM(verifyKey);

        const protocolData: Protocol.HelloData = {
            type: "hello",
            public_key: exportedPEM,
        }

        return new HelloData(protocolData, verifyKey);
    }

    static async fromProtocol(protocolData: Protocol.HelloData): Promise<HelloData> {
        // Import the key from the PEM
        return new HelloData(protocolData, await PEMToKey(protocolData.public_key, PSSImportParams));
    }
}
export class CleartextChat {
    readonly destinationServers: string[];
    readonly senderFingerprint: string;
    readonly recipientFingerprints: string[];
    readonly message: string;

    public constructor(destinationServers: string[], senderFingerprint: string, recipientFingerprints: string[], message: string) {
        this.destinationServers = destinationServers;
        this.senderFingerprint = senderFingerprint;
        this.recipientFingerprints = recipientFingerprints;
        this.message = message;
    }
}
export class ChatData extends MessageDataBase<Protocol.ChatData> {
    readonly destinationServers: string[];
    readonly iv: ArrayBuffer;
    readonly symm_keys: ArrayBuffer[];
    readonly chat: ArrayBuffer;

    private constructor(protocolData: Protocol.ChatData, destinationServers: string[], iv: ArrayBuffer, symm_keys: ArrayBuffer[], chat: ArrayBuffer) {
        super(protocolData);

        this.destinationServers = destinationServers;
        this.iv = iv;
        this.symm_keys = symm_keys;
        this.chat = chat;
    }

    public async tryDecrypt(fingerprint: string, decryptKey: CryptoKey): Promise<CleartextChat | undefined> {
        const decoder = new TextDecoder("utf-8", {fatal: true});

        for (const encryptedKey of this.symm_keys) {
            try {
                // Get the symmetric key
                const symmKeyBuffer = await crypto.subtle.decrypt(OAEPParams, decryptKey, encryptedKey);
                const symmKey = await crypto.subtle.importKey("raw", symmKeyBuffer, "AES-GCM", true, ["encrypt", "decrypt"]);

                // Try decrypting the chat
                const AESParams: AesGcmParams = {
                    name: "AES-GCM",
                    iv: this.iv,
                    tagLength: 128
                };
                const decryptedBuffer = await crypto.subtle.decrypt(AESParams, symmKey, this.chat);
                const decryptedJSON = decoder.decode(decryptedBuffer);
                const decrypted = JSON.parse(decryptedJSON) as Protocol.Chat;

                if (!decrypted.participants.includes(fingerprint))
                    continue;

                return new CleartextChat(this.destinationServers, decrypted.participants[0], decrypted.participants.slice(1), decrypted.message);
            } catch (e) {
                // Some error so it probably wasn't the correct key
                // console.log(e);
                continue;
            }
        }
    }

    static fromProtocol(protocolData: Protocol.ChatData) {
        return new ChatData(
            protocolData,
            protocolData.destination_servers,
            decode(protocolData.iv),
            protocolData.symm_keys.map(key => decode(key)),
            decode(protocolData.chat)
        );
    }

    static async create(message: string, senderFingerprint: string, recipients: [string, CryptoKey][], destinationServers: string[]): Promise<ChatData> {
        let participantFingerprints = [senderFingerprint];
        for (const recipient of recipients)
            participantFingerprints.push(recipient[0]);

        const chat: Protocol.Chat = {
            participants: participantFingerprints,
            message: message,
        };

        // Generate AES key
        let symmKey = await crypto.subtle.generateKey(AESGenParams, true, ["encrypt", "decrypt"]);

        let exportedKey = await crypto.subtle.exportKey("raw", symmKey);

        // Encrypt chat
        const iv = crypto.getRandomValues(new Uint8Array(16));
        const GCMParams: AesGcmParams = {
            name: "AES-GCM",
            iv: iv,
            tagLength: 128
        };
        let chatBuffer = new TextEncoder().encode(JSON.stringify(chat));
        let encryptedChat = await crypto.subtle.encrypt(GCMParams, symmKey, chatBuffer);

        // Encrypt keys for recipients
        let recipientSymmKeys = [];
        for (const recipient of recipients)
            recipientSymmKeys.push(await crypto.subtle.encrypt(OAEPParams, recipient[1], exportedKey));


        const protocolData: Protocol.ChatData = {
            type: "chat",
            destination_servers: destinationServers,
            iv: encode(iv),
            symm_keys: recipientSymmKeys.map(key => encode(key)),
            chat: encode(encryptedChat),
        };

        return new ChatData(protocolData, destinationServers, iv, recipientSymmKeys, encryptedChat);
    }
}
export class PublicChatData extends MessageDataBase<Protocol.PublicChatData> {
    readonly senderFingerprint: string;
    readonly message: string;

    private constructor(protocolData: Protocol.PublicChatData, senderFingerprint: string, message: string) {
        super(protocolData);

        this.senderFingerprint = senderFingerprint;
        this.message = message;
    }

    static create(senderFingerprint: string, message: string) {
        const protocolData: Protocol.PublicChatData = {
            type: "public_chat",
            sender: senderFingerprint,
            message: message,
        }

        return new PublicChatData(protocolData, senderFingerprint, message)
    }

    static fromProtocol(protocolData: Protocol.PublicChatData): PublicChatData {
        return new PublicChatData(protocolData, protocolData.sender, protocolData.message);
    }
}
export class ServerHelloData extends MessageDataBase<Protocol.ServerHelloData> {
    readonly serverAddress: string;

    private constructor(protocolData: Protocol.ServerHelloData, serverAddress: string) {
        super(protocolData);
        this.serverAddress = serverAddress;
    }

    static create(serverAddress: string) {
        const protocolData: Protocol.ServerHelloData = {
            type: "server_hello",
            sender: serverAddress
        };
    }

    static fromProtocol(protocolData: Protocol.ServerHelloData): ServerHelloData {
        return new ServerHelloData(protocolData, protocolData.sender);
    }
}
export class SignedData<TData extends MessageDataBase<Protocol.SignedDataEntry>> extends MessageBase<Protocol.SignedData> {
    readonly data: TData;
    readonly counter: number;
    readonly signature: ArrayBuffer;

    private constructor(protocolMessage: Protocol.SignedData, data: TData, counter: number, signature: ArrayBuffer) {
        super(protocolMessage);

        this.data = data;
        this.counter = counter;
        this.signature = signature;
    }

    public async verify(verifyKey: CryptoKey): Promise<boolean> {
        const payloadString = JSON.stringify(this.data.protocol) + this.counter.toString();
        const encodedPayload = new TextEncoder().encode(payloadString);

        return await crypto.subtle.verify(PSSParams, verifyKey, this.signature, encodedPayload);
    }

    static async create<TData extends MessageDataBase<Protocol.SignedDataEntry>>
        (data: TData, counter: number, signKey: CryptoKey): Promise<SignedData<TData>> {
        // Generate signature.
        const payloadString = JSON.stringify(data.protocol) + counter.toString();
        const encodedPayload = new TextEncoder().encode(payloadString);

        const signature = await webCrypto.sign(PSSParams, signKey, encodedPayload);

        const protocolMessage: Protocol.SignedData = {
            type: "signed_data",
            data: data.protocol,
            counter: counter,
            signature: encode(signature)
        };

        return new SignedData(protocolMessage, data, counter, signature);
    }

    static async fromProtocol(protocolMessage: Protocol.SignedData): Promise<SignedData<MessageDataBase<Protocol.SignedDataEntry>> | undefined> {
        let data = await (async () => {
            switch (protocolMessage.data.type) {
                case "hello":
                    return await HelloData.fromProtocol(protocolMessage.data);
                case "chat":
                    return ChatData.fromProtocol(protocolMessage.data);
                case "public_chat":
                    return PublicChatData.fromProtocol(protocolMessage.data);
                case "server_hello":
                    return ServerHelloData.fromProtocol(protocolMessage.data);
                default:
                    return undefined;
            }
        })();

        if (data == undefined)
            // Error
            return undefined;

        return new SignedData(protocolMessage, data, protocolMessage.counter, decode(protocolMessage.signature));
    }
}

export class ClientListRequest extends MessageBase<Protocol.ClientListRequest> {
    static fromProtocol(protocolMessage: Protocol.ClientListRequest): ClientListRequest {
        return new ClientListRequest(protocolMessage);
    }
}

export class ClientList extends MessageBase<Protocol.ClientList> {
    readonly servers: {
        address: string;
        clientVerifyKeys: CryptoKey[]
    }[];

    private constructor(protocolMessage: Protocol.ClientList, servers: { address: string; clientVerifyKeys: CryptoKey[] }[]) {
        super(protocolMessage);

        this.servers = servers;
    }

    static async create(servers: { address: string; clientVerifyKeys: CryptoKey[] }[]) {
        let resultServers: {
            address: string;
            clients: string[];
        }[] = [];

        for (const server of servers) {
            let resultClients = [];
            for (const key of server.clientVerifyKeys) {
                resultClients.push(await keyToPEM(key));
            }

            resultServers.push({address: server.address, clients: resultClients});
        }

        const protocolMessage: Protocol.ClientList = {
            type: "client_list",
            servers: resultServers
        };

        return new ClientList(protocolMessage, servers);
    }

    static async fromProtocol(protocolMessage: Protocol.ClientList) {
        let servers: {
            address: string;
            clientVerifyKeys: CryptoKey[]
        }[] = [];

        for (const server of protocolMessage.servers) {
            let keys: CryptoKey[] = [];
            for (const pem of server.clients)
                keys.push(await PEMToKey(pem, PSSImportParams));

            servers.push({address: server.address, clientVerifyKeys: keys});
        }

        return new ClientList(protocolMessage, servers);
    }
}

export class ClientUpdate extends MessageBase<Protocol.ClientUpdate> {
    readonly clientVerifyKeys: CryptoKey[];

    private constructor(protocolMessage: Protocol.ClientUpdate, clientVerifyKeys: CryptoKey[]) {
        super(protocolMessage);

        this.clientVerifyKeys = clientVerifyKeys;
    }

    static async create(clientVerifyKeys: CryptoKey[]) {
        let resultPEM: string[] = [];

        for (const key of clientVerifyKeys) {
            resultPEM.push(await keyToPEM(key));
        }

        const protocolMessage: Protocol.ClientUpdate = {
            type: "client_update",
            clients: resultPEM
        }

        return new ClientUpdate(protocolMessage, clientVerifyKeys);
    }

    static async fromProtocol(protocolMessage: Protocol.ClientUpdate) {
        let keys: CryptoKey[] = [];

        for (const pem of protocolMessage.clients) {
            keys.push(await PEMToKey(pem, PSSImportParams));
        }

        return new ClientUpdate(protocolMessage, keys);
    }

}

export class ClientUpdateRequest extends MessageBase<Protocol.ClientUpdateRequest> {
    static create() {
        const protocolMessage: Protocol.ClientUpdateRequest = {
            type: "client_update_request",
        };

        return new ClientUpdateRequest(protocolMessage);
    }

    static fromProtocol(protocolMessage: Protocol.ClientUpdateRequest) {
        return new ClientUpdateRequest(protocolMessage);
    }
}

// Which message types is a client allowed to send?
export type ClientSendableSignedDataEntry = HelloData | ChatData | PublicChatData;
export type ClientSendableSignedData = SignedData<ClientSendableSignedDataEntry>;
// export type ClientSendableSignedData = SignedData<HelloData> | SignedData<ChatData> | SignedData<PublicChatData>;
export type ClientSendable = ClientSendableSignedData | ClientListRequest;

export type ClientToClientSendable = SignedData<ChatData | PublicChatData>;

// Which message types is a server allowed to send to another server?
export type ServerToServerSendableSignedDataEntry = ServerHelloData | ChatData | PublicChatData;
export type ServerToServerSendableSignedData = SignedData<ServerToServerSendableSignedDataEntry>;
// export type ServerToServerSendableSignedData = SignedData<ServerHelloData> | SignedData<ChatData> | SignedData<PublicChatData>;
export type ServerToServerSendable = ServerToServerSendableSignedData | ClientUpdateRequest | ClientUpdate;

// Which message types is a server allowed to send to a client?
export type ServerToClientSendableSignedDataEntry = ChatData | PublicChatData;
export type ServerToClientSendableSignedData = SignedData<ServerToClientSendableSignedDataEntry>;
// export type ServerToClientSendableSignedData = SignedData<ChatData> | SignedData<PublicChatData>;
export type ServerToClientSendable = ServerToClientSendableSignedData | ClientList;