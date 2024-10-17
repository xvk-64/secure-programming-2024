import React, {useRef, useState} from "react";
import {Login} from "./components/Login.js";
import {ClientContext, ClientContextType} from "./context/ClientContext.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {Chat} from "./components/Chat.js";
import "./styles/App.css"

export function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [clientContext, setClientContext] = useState<ClientContextType>(useRef(undefined));

    async function onLogin(client: ChatClient, serverAddress: string) {
        if (clientContext === undefined)
            return;

        // Create context
        clientContext.current = {
            client: client,
            serverAddress: serverAddress,
        };
        setIsLoggedIn(true);

        client.onDisconnect.createListener(() => {
            setIsLoggedIn(false);

            setClientContext(useRef(undefined));
        }, true);
    }

    return (
        <>
        {(isLoggedIn)
            ? <ClientContext.Provider value={clientContext}>
                <Chat/>
            </ClientContext.Provider>
            : <Login onLogin={onLogin}/>
        }
        </>
    );
}