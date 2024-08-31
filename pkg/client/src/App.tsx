import React, {useEffect, useState} from "react";
import {hello} from "@sp24/common"

export const App : React.FC = () => {
    const [message, setMessage] = useState("")

    useEffect(() => {
        const ws = new WebSocket(document.URL);

        ws.addEventListener("open", event => {
            console.log("Opened WebSocket connection");
        })

        ws.addEventListener("message", event => {
            setMessage(event.data);
        })
    })

    return <p>
            Hello, world!<br/>
            message: {hello()}<br/>
            server: {message}
        </p>;
}