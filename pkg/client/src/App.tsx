import React, {useEffect, useState} from "react";
import "./App.css";
import {ChatWrapper} from "./ChatWrapper.js";


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

    return <ChatWrapper></ChatWrapper>
}