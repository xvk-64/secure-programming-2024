import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import ChatBox from "./Chatbox.js";
import { UserProvider } from "./UserContext.js";
import { ChatProvider } from "./ChatContext.js";

export const App : React.FC = () => {
    useEffect(() => {
        localStorage.setItem("keyPair", "{\"privateKey\":\"test\",\"publicKey\":\"test\"}");
        localStorage.setItem("friends", "{\"TEST1\":\"alice\",\"TEST2\":\"bob\"}");
        localStorage.setItem("groups", '[{"groupInfo":{"users":["TEST1","TEST2"]},"chatLog":[{"sender":"TEST1","message":"hello"},{"sender":"TEST2","message":"hi"},{"sender":"TEST1","message":"whats going on?"}]}]');
        localStorage.setItem("servers", "[\"http://localhost:3307/\"]");
    }, []);
    return <UserProvider><ChatProvider><ChatBox></ChatBox></ChatProvider></UserProvider>
}