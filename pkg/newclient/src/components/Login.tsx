import React from "react";
import {useState} from "react";
import {WebSocketClientTransport} from "../client/WebSocketClientTransport.js";
import {ChatClient} from "@sp24/common/chatclient/ChatClient.js";
import {PSSGenParams} from "@sp24/common/util/crypto.js";

export type LoginProps = {
    onLogin: (client: ChatClient, serverAddress: string) => void;
}

export function Login(props: LoginProps) {
    const [statusMessage, setStatusMessage] = useState("Enter server address below.")
    const [serverAddress, setServerAddress] = useState<string>("ws://localhost:3307");
    const [inputEnabled, setInputEnabled] = useState<boolean>(true);

    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        setInputEnabled(false);
        setStatusMessage("Checking...");

        const cleanedAddress = serverAddress.replace(/(^\w+:|^)\/\//, '');
        let usingSecure = true;

        WebSocketClientTransport.connect("wss://" + cleanedAddress)
            .catch(err => {
                // Fallback to unsecure socket
                usingSecure = false;

                console.log("Secure connection failed, falling back to ws://");
                setStatusMessage("Checking unsecure...")

                return WebSocketClientTransport.connect("ws://" + cleanedAddress)
            })
            .then(async transport => {
                // Successfully connected.
                setStatusMessage("Connected to server. Logging in...");

                // Get keys
                const keyPair = await crypto.subtle.generateKey(PSSGenParams, true, ["sign", "verify"]);

                // Create client.
                const client = await ChatClient.create(transport, keyPair.privateKey, keyPair.publicKey, () => {
                    props.onLogin(client, (usingSecure ? "https://" : "http://") + cleanedAddress);
                    setStatusMessage("Logged in! Loading app...");
                })
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