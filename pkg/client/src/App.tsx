import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {UserProvider} from "./UserContext.js";
import {ChatProvider} from "./ChatContext.js";
import ChatBox from "./Chatbox.js";
import {LoginForm} from "./addingcontext/LoginForm.js";
import {WebSocketClientTransport} from "./client/WebSocketClientTransport.js";
import {PSSGenParams} from "@sp24/common/util/crypto.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";


export const App : React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const client = useRef<ChatClient>();

    const [messages, setMessages] = useState<{ key: number, message: string }[]>([]);

    async function onConnection(transport: WebSocketClientTransport) {
        const keys = await crypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

        client.current = await ChatClient.create(transport, keys.privateKey, keys.publicKey);

        client.current.onPublicChat.createListener(publicChat => {
            setMessages(msgs => [...msgs, {key: Date.now(), message: publicChat.message}]);
        })

        setIsLoggedIn(true);
    }

    return (
        <div className="App">
            { !isLoggedIn && <LoginForm onConnect={onConnection}/> }
            { isLoggedIn && messages.map(m => <div key={m.key}>{m.message}</div>)}
        </div>
    )
}