import { ChatClient } from "@sp24/common/chatclient/ChatClient.js";
import { WebSocketClientTransport } from "@sp24/common/chatclient/WebSocketClientTransport.js";
import React, { createContext, MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext.js";

type ChatContext = {
    sendChat: (group: number, message: string) => Promise<void>,
}

export const ChatContext = createContext<ChatContext | null>(null);

export const ChatProvider = (({ children }: any) => {
    const {groups, appendMessage} = useContext(UserContext) || {} as UserContext;
    const chatClient: MutableRefObject<ChatClient | null> = useRef(null);
    const [chatClientState, setChatClientState] = useState<ChatClient | null>(null);
    useEffect(() => {  
        const webSocketClientTransport = new WebSocketClientTransport();
        (async () => {
            if(webSocketClientTransport) {
                chatClient.current = await ChatClient.create(webSocketClientTransport);
                chatClient.current.onChat.createListener((data) => {
                    console.log("received chat");
                    console.log(JSON.stringify(data));
                });
                chatClient.current.onPublicChat.createListener((data) => {
                    console.log("received public chat");
                    console.log(JSON.stringify(data));
                });
                setChatClientState(chatClient.current);
            }
        })();
    }, []);

    const [chat, setChat] = useState({
        sendChat: (group: number, message: string) => {return Promise.resolve();},
        online: {"you": "localhost"},
    });

    useEffect(() => {
        if(chatClientState) {
            setChat({
                sendChat: async (group: number, message: string) => {
                    const fingerprintList = groups[group].groupInfo.users;
                    if(chatClientState) {
                        const groupId = await chatClientState.getGroupID(fingerprintList);
                        chatClientState.sendChat(message, groupId);
                        appendMessage(group, chatClientState.fingerprint, message);
                    }
                    return Promise.resolve();
                },
                online: {"you": "localhost"},
            });
        }
    }, [chatClientState]);
    const ret = chat;
    return <ChatContext.Provider value={ret}>{children}</ChatContext.Provider>
});