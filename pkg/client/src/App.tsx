import React, {useEffect, useState} from "react";
import {hello} from "@sp24/common";
import "./App.css";

import { test } from './Test.js';

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
            message2 : test()
            server: {message}
            <div className='main'>
                <div className='leftDiv'>sidebar stuff goes here</div>
                <div className='middleDiv'>
                    <div className='chatDiv'>wow chat goes here?? pls</div>
                </div>
                <div className='rightDiv'>maybe friends and server go here</div>
            </div>
        </p>;
}