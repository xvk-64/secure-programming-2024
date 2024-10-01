import { ChatClient } from "@sp24/common/chatclient/ChatClient.js";
import { WebSocketTransport } from "@sp24/common/websocket/WebSocketTransport.js";
import React, { createContext, MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext.js";
import { WebSocketClientTransport } from "./client/WebSocketClientTransport.js";

type ChatContext = {
    // funciton send a chat message
    sendChat: (group: number, message: string) => Promise<void>,
    sendPublicChat: (message: string) => Promise<void>,
    // list of who is online and on which server
    online: {[fingerprint: string]: string}, // ***** TODO
    // if the chat is ready for messages to be sent
    ready: boolean,
    // function to change ths serever
    changeServer: (serverIndex: number) => void,
}

export const ChatContext = createContext<ChatContext | null>(null);

export const ChatProvider = (({ children }: any) => {
    const {exists, groups, appendMessage, appendPublicMessage, servers, privKeyPEM, pubKeyPEM} = useContext(UserContext) || {} as UserContext;
    const chatClient: MutableRefObject<ChatClient | null> = useRef(null);
    const [chatClientState, setChatClientState] = useState<ChatClient | null>(null);
    const [ready, setReady] = useState(false);
    const [connectedServer, setConnectedServer] = useState(0);
    const [connectionState, setConnectionState] = useState<"none" | "created" | "connected" | "failed">("none");
    const webSocketClientTransport = useRef<WebSocketClientTransport | null>(null);
    useEffect(() => {
        if(exists) {
            setConnectionState("created");
            WebSocketClientTransport.connect(servers[connectedServer]).then((value) => {
                webSocketClientTransport.current = value;
                setConnectionState("connected");
            }, (reason) => {
                setConnectionState("failed");
            });
        }
    }, [connectedServer, exists]);

    useEffect(() => {
        if(webSocketClientTransport.current && connectionState === "connected") {
            (async () => {
                if(webSocketClientTransport.current && privKeyPEM && pubKeyPEM) {
                    chatClient.current = await ChatClient.create(webSocketClientTransport.current, privKeyPEM, pubKeyPEM);
                    chatClient.current.onChat.createListener((data) => {
                        groups.forEach((value, index) => {
                            if(value.groupInfo.fingerprint === data.groupID)
                                appendMessage(index, data.senderFingerprint, data.message);
                        });
                    });
                    chatClient.current.onPublicChat.createListener((data) => {
                        appendPublicMessage(data.senderFingerprint, data.message);
                    });
                    setChatClientState(chatClient.current);
                    setReady(true);
                }
            })();
        }
    }, [connectionState]);

    const [chat, setChat] = useState<ChatContext>({
        sendChat: (group: number, message: string) => {return Promise.reject();},
        online: {"you": "localhost"},
        ready: false,
        changeServer: setConnectedServer,
        sendPublicChat: (message: string) => {return Promise.reject();},
    });

    useEffect(() => {
        if(chatClientState) {
            setChat({
                sendChat: async (group: number, message: string) => {
                    const fingerprintList = groups[group].groupInfo.users;
                    if(chatClientState) {
                        const groupId = chatClientState.getGroupID(fingerprintList);
                        chatClientState.sendChat(message, groupId);
                        appendMessage(group, chatClientState.fingerprint, message);
                    }
                    return Promise.resolve();
                },
                online: {"you": "localhost"},
                ready: ready,
                changeServer: setConnectedServer,
                sendPublicChat: async (message: string) => {
                    if(chatClientState) {
                        chatClientState.sendPublicChat(message);
                        appendPublicMessage(chatClientState.fingerprint, message);
                    }
                    return Promise.resolve();
                },
            });
        }
    }, [chatClientState, ready]);
    const ret = chat;
    return <ChatContext.Provider value={ret}>{children}</ChatContext.Provider>
});