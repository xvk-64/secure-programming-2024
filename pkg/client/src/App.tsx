import React, {useEffect, useState} from "react";
import "./App.css";
import {hello} from "@sp24/common";
// declare module "*.module.css";
// import styles from "./main.module.css";

import ChatBox from "./ChatBox.js"
import GroupUserList from "./GroupUserList.js";
import ServerList from "./ServerList.js";
import ChatInput from "./ChatInput.js";


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

            <div  className="main" style={{width: "1200px", height: "600px", padding: "15px", borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin", display: "block",  float: "none", flex:1, lineHeight: "normal", backgroundColor: "rgb(252,252,252)"}}>
                <div  className="leftDiv" style={{width: "200px", height: "600px", padding: "10px", margin: "2px", borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin", display: "block", float: "left", flex:1, lineHeight: "normal", backgroundColor: "grey"}}><p>sidebar</p></div>
                <div className="middleDiv"style={{width: "600px", height: "700px", float:"left", margin: "20px"}}>
                    <div className="chatDiv" style={{overflowY: "scroll", width: "500px", height: "400px", padding: "10px", borderStyle : "inset", borderColor:"rgb(195,196,200)", borderWidth: "thin", flex:1, lineHeight: "normal", backgroundColor: "white"}}>
                        
                        <ChatBox></ChatBox>
                    </div>
                    <ChatInput></ChatInput>
                </div>
                
                <div className="rightDiv" style={{overflowY: "scroll", width: "200px", padding: "10px", margin: "2px", borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin",  display: "block", float: "right", flex:1, lineHeight: "normal", backgroundColor: "white"}}>
                    <ServerList></ServerList>
                    <GroupUserList></GroupUserList>
                </div>
            </div>
      
        
        </>
}