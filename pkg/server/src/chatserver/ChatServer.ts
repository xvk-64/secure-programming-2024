// Main logic for server
import type {IServerEntryPoint} from "./IServerEntryPoint.js";
import type {IServerToClientTransport} from "./IServerToClientTransport.js";
import {EventListener} from "@sp24/common/util/EventEmitter.js";
import {
    ChatData,
    ClientList,
    ClientSendable,
    ClientSendableSignedData,
    PublicChatData,
    SignedData
} from "@sp24/common/messageTypes.js";
import {ConnectedClient} from "./ConnectedClient.js";
import {webcrypto} from "node:crypto";
import {log} from "node:util";


export class ChatServer {
    private _entryPoints: IServerEntryPoint[];

    private _clients: ConnectedClient[] = [];

    private _clientConnectListeners: EventListener<IServerToClientTransport>[] = [];
    private async onClientConnect(client: ConnectedClient) {
        console.log(`Client connected: ${client.fingerprint}`)

        this._clients.push(client);

        let messageListener = client.onMessageReady.createListener((message: ClientSendable) => {
            this.onClientMessage(client, message);
        });

        // Handle disconnection
        client.onDisconnect.createListener(() => {
            client.onMessageReady.removeListener(messageListener);
            this._clients.splice(this._clients.indexOf(client), 1);
        }, true);
    }

    private sendClientList() {
        // List of all clients I know about

        let keys: webcrypto.CryptoKey[] = [];
        for (const client of this._clients) {
            if (client.verifyKey !== undefined)
                keys.push(client.verifyKey);
        }

        for (const client of this._clients) {
            const clientListMessage = new ClientList([{
                address: client.entryPoint.address,
                clientVerifyKeys: keys
            }]);

            client.sendMessage(clientListMessage);
        }
    }


    private onClientMessage(client: ConnectedClient, message: ClientSendable) {
        let logMessage = `Client message from ${client.fingerprint}: ${message.type} `;

        // We know the message has already been validated.

        // Check what to do with this message.
        switch (message.type) {
            case "signed_data":
                const signedDataMessage = message as ClientSendableSignedData;

                logMessage += signedDataMessage.data.type + " ";

                switch (signedDataMessage.data.type) {
                    case "hello":
                        // Do client_list to my clients
                        this.sendClientList();
                        // Do client_update to other servers
                        break;
                    case "chat":
                        // Route to destination servers
                        const chatMessage = signedDataMessage as SignedData<ChatData>

                        if (chatMessage.data.destinationServers.includes(client.entryPoint.address)) {
                            for (const otherClient of this._clients) {
                                if (otherClient.fingerprint == client.fingerprint)
                                    // Don't send message to the same client
                                    continue;

                                otherClient.sendMessage(chatMessage);
                            }
                        }
                        break;
                    case "public_chat":
                        const publicChatMessage = signedDataMessage as SignedData<PublicChatData>;

                        logMessage += "\"" + publicChatMessage.data.message + "\" ";

                        // Forward message on.
                        for (const otherClient of this._clients) {
                            if (otherClient.fingerprint == client.fingerprint)
                                // Don't send message to the same client
                                continue;

                            otherClient.sendMessage(publicChatMessage);
                        }
                        // Send to other servers.
                        break;
                }
                break;
            case "client_list_request":
                // Do client_list
                this.sendClientList();
                break;
        }

        // console.log(logMessage);
    }

    public constructor(entryPoints: IServerEntryPoint[]) {
        this._entryPoints = entryPoints;

        // Set up listeners for clients connecting to the server.
        entryPoints.forEach(entryPoint => {
            this._clientConnectListeners.push(entryPoint.onClientConnect.createListener((clientTransport) => {
                this.onClientConnect(new ConnectedClient(clientTransport, entryPoint));
            }));
        });
    }
}