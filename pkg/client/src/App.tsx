import React, {useEffect, useState} from "react";
import {hello} from "@sp24/common";
// declare module "*.module.css";
// import styles from "./main.module.css";
import Test from "./Test.js";
import ChatBox from "./ChatBox.js"
import GroupUserList from "./GroupUserList.js";

// import Test from './Test';

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

   


    return <>
            <p>
            Hello, world!<br/>
            message: {hello()}<br/>
           

            server: {message}
            </p>

            <div className="main">
                <div className="leftDiv"><p>sidebar</p></div>
                <div className="middleDiv">
                    <p>middle</p>
                    <ChatBox></ChatBox>
                </div>
                <div className="rightDiv">
                    <GroupUserList></GroupUserList>
                    </div>
            </div>
      
        
        </>
}