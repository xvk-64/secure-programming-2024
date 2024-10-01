import { ChatClient } from "@sp24/common/chatclient/ChatClient.js";
import React, { createContext, MutableRefObject, useContext, useEffect, useRef, useState } from "react";
import {UserContext} from "./UserContext.js";
import {WebSocketClientTransport} from "./client/WebSocketClientTransport.js";

type ChatContext = {
    sendChat: (group: number, message: string) => void,
}

export const ChatContext = createContext<ChatContext | null>(null);

export const ChatProvider = (({ children }:any) => {
    const {groups, appendMessage} = useContext(UserContext) || {} as UserContext;
    const chatClient: MutableRefObject<ChatClient | null> = useRef(null);
    const [chatClientState, setChatClientState] = useState<ChatClient | null>(null);
    useEffect(() => {  
        const webSocketClientTransport = null;// new WebSocketClientTransport();
        (async () => {
            // if (webSocketClientTransport) {
            //     chatClient.current = await ChatClient.create(webSocketClientTransport);
            //     chatClient.current.onChat.createListener((data) => {
            //         console.log("received chat");
            //         console.log(JSON.stringify(data));
            //     });
            //     chatClient.current.onPublicChat.createListener((data) => {
            //         console.log("received public chat");
            //         console.log(JSON.stringify(data));
            //     });
            //     setChatClientState(chatClient.current);
            // }
        })();
    }, []);

    const [chat, setChat] = useState({
        sendChat: (group: number, message: string) => {},
        online: {"you": "localhost"},
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
                },
                online: {"you": "localhost"},
            });
        }
    }, [chatClientState]);
    const ret = chat;
    return <ChatContext.Provider value={ret}>{children}</ChatContext.Provider>
});