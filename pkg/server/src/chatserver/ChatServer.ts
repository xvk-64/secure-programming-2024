// Main logic for server
import type {IServerEntryPoint} from "./IServerEntryPoint.js";
import type {IServerToClientTransport} from "./IServerToClientTransport.js";
import {EventListener} from "@sp24/common/util/Event.js";
import {ClientSendable} from "@sp24/common/messageTypes.js";
import {ConnectedClient} from "./ConnectedClient.js";

type ClientMessageListenerData = {
    client: IServerToClientTransport;
    message: ClientSendable;
}

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

    private onClientMessage(client: ConnectedClient, message: ClientSendable) {
        console.log(`Client message from ${client.fingerprint}: ${message.type}`)
    }

    public constructor(entryPoints: IServerEntryPoint[]) {
        this._entryPoints = entryPoints;

        // Set up listeners for clients connecting to the server.
        entryPoints.forEach(entryPoint => {
            this._clientConnectListeners.push(entryPoint.onClientConnect.createListener((clientTransport) => {
                this.onClientConnect(new ConnectedClient(clientTransport));
            }));
        });
    }
}