// Main logic for server
import type {EntryPoint} from "./EntryPoint.js";
import type {IServerToClientTransport} from "./IServerToClientTransport.js";
import {EventListener} from "@sp24/common/util/EventEmitter.js";
import {
    ChatData,
    ClientList,
    ClientSendable,
    ClientSendableSignedData, ClientUpdate, ClientUpdateRequest,
    PublicChatData, ServerHelloData, ServerToClientSendable, ServerToServerSendable, ServerToServerSendableSignedData,
    SignedData
} from "@sp24/common/messageTypes.js";
import {ConnectedClient} from "./ConnectedClient.js";
import {webcrypto} from "node:crypto";
import {ConnectedServer} from "./ConnectedServer.js";
import {IServerToServerTransport} from "./IServerToServerTransport.js";
import {TestServerToServerTransport} from "./testclient/TestServerToServerTransport.js";


export class ChatServer {
    readonly address: string;
    private readonly _signKey: webcrypto.CryptoKey;
    private readonly _verifyKey: webcrypto.CryptoKey;
    private _counter: number = 0;

    private _entryPoints: EntryPoint[];

    private _clients: ConnectedClient[] = [];

    private _clientConnectListeners: EventListener<ConnectedClient>[] = [];
    private async onClientConnect(client: ConnectedClient) {
        console.log(`${this.address}: Client connected: ${client.fingerprint}`);

        this._clients.push(client);

        let messageListener = client.onMessageReady.createAsyncListener(async message => {
            this.onClientMessage(client, message);
        });

        // Do client_list to my clients
        this.sendClientList();

        // Do client_update to other servers
        const clientUpdateMessage = new ClientUpdate(this._clients.map(client => client.verifyKey));
        for (const address in this._neighbourhoodServers)
            this._neighbourhoodServers[address].sendMessage(clientUpdateMessage);

        // Handle disconnection
        client.onDisconnect.createListener(() => {
            console.log(`${this.address}: Client disconnected: ${client.fingerprint}`);
            client.onMessageReady.removeListener(messageListener);
            this._clients.splice(this._clients.indexOf(client), 1);
        }, true);
    }

    private sendClientList() {
        // List of all clients I know about

        let clientKeys: {[address: string]: webcrypto.CryptoKey[]} = {}

        // Collect my clients
        clientKeys[this.address] = this._clients.map(client => client.verifyKey);

        // Collect neighbourhood clients
        for (let address in this._neighbourhoodServers) {
            clientKeys[address] = this._neighbourhoodServers[address].clients.map(client => client.verifyKey);
        }

        // Reformat data
        let clientList: {address: string, clientVerifyKeys: webcrypto.CryptoKey[]}[] = [];
        for (const address in clientKeys) {
            clientList.push({address: address, clientVerifyKeys: clientKeys[address]});
        }

        // Send client list
        const clientListMessage = new ClientList(clientList);
        this._clients.forEach(client => client.sendMessage(clientListMessage));
    }

    private async relayMessage(message: ServerToClientSendable & ServerToServerSendable, destinationAddress: string[] | "all") {
        if (destinationAddress === "all") {
            // Relay to all clients


        } else {
            // Relay to specific servers


        }

    }

    private onClientMessage(client: ConnectedClient, message: ClientSendable) {
        let logMessage = `Client message from ${client.fingerprint}: ${message.type} `;

        // We know the message has already been validated.

        // Check what to do with this message.
        switch (message.type) {
            case "signed_data":
                logMessage += message.data.type + " ";

                switch (message.data.type) {
                    case "hello":
                        // Clients shouldn't send more hellos after joining.

                        break;
                    case "chat":
                        // Route to destination servers
                        const chatMessage = message as SignedData<ChatData>

                        // Relay to my clients.
                        if (chatMessage.data.destinationServers.includes(this.address))
                            this._clients.map(client => client.sendMessage(chatMessage))

                        // Relay to other servers
                        chatMessage.data.destinationServers
                            .filter(address => address != this.address && (address in this._neighbourhoodServers))
                            .map(address => this._neighbourhoodServers[address].sendMessage(chatMessage)
                        )
                        break;
                    case "public_chat":
                        const publicChatMessage = message as SignedData<PublicChatData>;

                        logMessage += "\"" + publicChatMessage.data.message + "\" ";

                        // Forward message on.

                        // Relay to my clients
                        this._clients.map(client => client.sendMessage(publicChatMessage))

                        // Relay to other servers
                        for (const address in this._neighbourhoodServers)
                            this._neighbourhoodServers[address].sendMessage(publicChatMessage);
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

    public async createServerHelloMessage() {
        const serverHelloData = new ServerHelloData(this.address);
        return await SignedData.create(serverHelloData, this._counter++, this._signKey);
    }

    private _neighbourhoodServers: {[address: string]: ConnectedServer} = {};

    private _serverConnectListeners: EventListener<ConnectedServer>[] = [];
    private async onServerConnect(server: ConnectedServer) {
        console.log(`${this.address}: Server connected: ${server.neighbourhoodEntry.address}`);

        this._neighbourhoodServers[server.neighbourhoodEntry.address] = server;

        // Reciprocate the connection with another server_hello.
        const serverHelloMessage = await this.createServerHelloMessage();
        await server.sendMessage(serverHelloMessage);

        const messageListener = server.onMessageReady.createAsyncListener(async message => {
            await this.onServerMessage(server, message);
        });

        // Request client update
        await server.sendMessage(new ClientUpdateRequest());

        server.onDisconnect.createAsyncListener(async () => {
            server.onMessageReady.removeListener(messageListener);
            delete this._neighbourhoodServers[server.neighbourhoodEntry.address];
        }, true);
    }

    private async onServerMessage(server: ConnectedServer, message: ServerToServerSendable) {
        switch (message.type) {
            case "signed_data":
                switch (message.data.type) {
                    case "server_hello":
                        // Don't let server update its keys
                        return
                    case "chat":
                        const chatMessage = message as SignedData<ChatData>;

                        // Distribute to my clients
                        this._clients.forEach(client => client.sendMessage(chatMessage));
                        break;
                    case "public_chat":
                        const publicChatMessage = message as SignedData<PublicChatData>;

                        // Distribute to my clients
                        this._clients.forEach(client => client.sendMessage(publicChatMessage));
                }
                break;
            case "client_update_request":
                // We need to send a client update.

                const clientUpdateMessage = new ClientUpdate(this._clients.map(client => client.verifyKey));
                await server.sendMessage(clientUpdateMessage);
                break;
            case "client_update":
                // The ConnectedServer will have already updated internal state.

                // Send a client list to my clients.
                this.sendClientList();
                break;
        }
    }


    public constructor(address: string, entryPoints: EntryPoint[], signKey: webcrypto.CryptoKey, verifyKey: webcrypto.CryptoKey) {
        this.address = address;

        this._entryPoints = entryPoints;

        this._signKey = signKey;
        this._verifyKey = verifyKey;

        // Set up listeners for clients connecting to the server.
        entryPoints.forEach(entryPoint => {
            this._clientConnectListeners.push(entryPoint.onClientConnect.createAsyncListener(async (client) => {
                await this.onClientConnect(client);
            }));

            this._serverConnectListeners.push(entryPoint.onServerConnect.createAsyncListener(async (server) => {
                await this.onServerConnect(server);
            }))
        });
    }
}