import React from "react";
import {useState} from "react";
import {WebSocketClientTransport} from "../client/WebSocketClientTransport.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {PSSGenParams} from "@sp24/common/util/crypto.js";

export type LoginProps = {
    onLogin: (client: ChatClient, serverAddress: string) => void;
}

// Activate vulnerability pre-generated keys
const betterKeygen = false;

export function Login(props: LoginProps) {
    const [statusMessage, setStatusMessage] = useState("Enter server address below.")
    const [serverAddress, setServerAddress] = useState<string>("ws://localhost:3307");
    const [inputEnabled, setInputEnabled] = useState<boolean>(true);

    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        setInputEnabled(false);
        setStatusMessage("Checking...");

        const cleanedAddress = serverAddress.replace(/(^\w+:|^)\/\//, '');

        WebSocketClientTransport.connect("ws://" + cleanedAddress)
            .then(async transport => {
                // Successfully connected.
                setStatusMessage("Connected to server. Logging in...");

                // Get keys
                const keyPair = await crypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

                // Create client.
                const client = await ChatClient.create(transport, keyPair.privateKey, keyPair.publicKey, () => {
                    props.onLogin(client, "http://" + cleanedAddress);
                    setStatusMessage("Logged in! Loading app...");
                })

                client.useBetterKeygen = betterKeygen;
            })
            .catch(err => {
                console.error(err)
                setInputEnabled(true);
                setStatusMessage("Invalid server address.");
            })
    }

    return (
        <>
            <span>{statusMessage}</span>
            <form onSubmit={onFormSubmit}>
                <input type="text" value={serverAddress} onChange={(e) => setServerAddress(e.target.value)} disabled={!inputEnabled} />
                <input type="submit" value="Connect" disabled={!inputEnabled} />
            </form>
        </>
    )
}