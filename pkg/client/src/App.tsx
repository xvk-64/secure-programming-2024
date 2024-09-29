import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import ChatBox from "./Chatbox";
import { UserProvider } from "./UserContext";
import { WebSocketClientTransport } from "@sp24/common/chatclient/WebSocketClientTransport.js";
import { ChatClient } from "@sp24/common/chatclient/ChatClient.js";

export const App : React.FC = () => {
    // useEffect(() => {
    //     localStorage.setItem("keyPair", "{\"privateKey\":\"test\",\"publicKey\":\"test\"}");
    //     localStorage.setItem("friends", "{\"TEST1\":\"alice\",\"TEST2\":\"bob\"}");
    //     localStorage.setItem("groups", '[{"groupInfo":{"users":["TEST1","TEST2"]},"chatLog":["hello", "hi", "whats going on?"]}]');
    //     localStorage.setItem("servers", "[\"http://localhost:3307/\"]");
    // }, []);
    // return <UserProvider><ChatBox></ChatBox></UserProvider>
    const chatClient: MutableRefObject<ChatClient | null> = useRef(null);
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
                setTimeout(() => {
                    chatClient.current?.sendPublicChat("hello");
                }, 5000);
            }
        })();
    }, []);
    return <h1>Hi</h1>;
}