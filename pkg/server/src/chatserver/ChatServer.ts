// Main logic for server
import type {IServerEntryPoint} from "./IServerEntryPoint.js";
import type {IConnectedClient} from "./IConnectedClient.js";
import {EventListener} from "@sp24/common/util/Event.js";
import {ClientSendable} from "@sp24/common/messageTypes.js";

type ClientMessageListenerData = {
    client: IConnectedClient;
    message: ClientSendable;
}

export class ChatServer {
    private _entryPoints: IServerEntryPoint[];

    private _clients: IConnectedClient[] = [];

    private _clientConnectListeners: EventListener<IConnectedClient>[] = [];
    private onClientConnect(client: IConnectedClient) {

        console.log(`Client connected: ${client.getIdentifier()}`)

        this._clients.push(client);

        let receiveListener = client.onReceiveMessage.createListener((message: ClientSendable) => {
            this.onClientMessage(client, message);
        });

        // Handle disconnection
        client.onDisconnect.createListener(() => {
            client.onReceiveMessage.removeListener(receiveListener);
            this._clients.splice(this._clients.indexOf(client), 1);
        }, true);
    }

    private onClientMessage(client: IConnectedClient, message: ClientSendable) {
        console.log(`Client message from ${client.getIdentifier()}: ${message.type}`)
    }

    public constructor(entryPoints: IServerEntryPoint[]) {
        this._entryPoints = entryPoints;

        // Set up listeners for clients connecting to the server.
        entryPoints.forEach(entryPoint => {
            this._clientConnectListeners.push(entryPoint.onClientConnect.createListener((client: IConnectedClient) => {
                this.onClientConnect(client)
            }));
        });
    }
}