import React, {useEffect, useState} from "react";
import "./App.css";
import {hello} from "@sp24/common";
// declare module "*.module.css";
// import styles from "./main.module.css";

import ChatBox from "./ChatBox.js"
import GroupUserList from "./GroupUserList.js";
import ServerList from "./ServerList.js";
import ChatInput from "./ChatInput.js";
import GroupChatList from "./GroupChatList.js";
import DropDownMenus from "./DropDownMenus.js";


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

            <div  className="main">
                <div  className="leftDiv">
                    <p>sidebar</p>
                    <DropDownMenus></DropDownMenus>
                    </div>
                <div className="middleDiv">
                    <ChatBox></ChatBox>
                    <ChatInput></ChatInput>
                </div>
                
                <div className="rightDiv">
                    <ServerList></ServerList>
                    <GroupUserList></GroupUserList>
                </div>
            </div>
      
        
        </>
}