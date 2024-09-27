import { EventEmitter } from "@sp24/common/util/EventEmitter.js";
import { IServerEntryPoint } from "../IServerEntryPoint.js";
import { IServerToClientTransport } from "../IServerToClientTransport.js";
import { IServerToServerTransport } from "../IServerToServerTransport.js";
import { WebSocketServer } from "ws";
import { Server } from "http";
import { WebSocketServerToClientTransport } from "./WebSocketServerToClientTransport.js";

export class WebSocketEntryPoint implements IServerEntryPoint {
    private readonly webSocketServer;
    
    onClientConnect: EventEmitter<IServerToClientTransport> = new EventEmitter<IServerToClientTransport>();
    onServerConnect: EventEmitter<IServerToServerTransport> = new EventEmitter<IServerToServerTransport>();
    get address(): string {
        return "wss://localhost:3307/";
    }

    public constructor(httpServer: Server) {
        this.webSocketServer = new WebSocketServer({server: httpServer});
        this.webSocketServer.on("connection", (webSocket: WebSocket) => {
            // somehow need to tell the difference between server and client connections
            this.onClientConnect.dispatch(new WebSocketServerToClientTransport(webSocket));
        });
    }
}