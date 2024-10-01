import React, {FormEvent} from "react";
import {WebSocketClientTransport} from "../client/WebSocketClientTransport.js";

export type LoginFormProps = {
    onConnect: (transport: WebSocketClientTransport) => void;
}

export function LoginForm(props: LoginFormProps) {
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formElements = form.elements as typeof form.elements & {
            ServerURL: HTMLInputElement;
        }

        const serverURL = formElements.ServerURL.value;

        console.log(serverURL);

        WebSocketClientTransport.connect(serverURL)
            .then(transport => {
                if (transport !== undefined) {
                    console.log("Connection success");
                    props.onConnect(transport);
                }
            })
            .catch((err: Error) => {
            console.log("Connection failed");
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="ServerURL" placeholder="Enter URL" />
            <input type="submit" value="Login" />
        </form>
    )
}