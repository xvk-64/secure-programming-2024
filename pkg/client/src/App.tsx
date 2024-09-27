import React, {useEffect, useState} from "react";
import ChatBox from "./Chatbox";
import { UserProvider } from "./UserContext";

export const App : React.FC = () => {
    useEffect(() => {
        localStorage.setItem("keyPair", "{\"privateKey\":\"test\",\"publicKey\":\"test\"}");
        localStorage.setItem("friends", "{\"TEST1\":\"alice\",\"TEST2\":\"bob\"}");
        localStorage.setItem("groups", '[{"groupInfo":{"users":["TEST1","TEST2"]},"chatLog":["hello", "hi", "whats going on?"]}]');
        localStorage.setItem("servers", "[\"http://localhost:3307/\"]");
    }, []);
    return <UserProvider><ChatBox></ChatBox></UserProvider>
}