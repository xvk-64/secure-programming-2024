import React, {useEffect, useState} from "react";


export default function ChatBox() {
    let chatbox: React.ReactElement[] = []
    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const msgList = [
        {timestamp: '00:00',  name: 'fred', message: 'wowowowowowowowoww'},
        {timestamp: '00:05', name: 'coolbeanie', message: 'hey guys can you help im stuck in the void'},
        {timestamp: '00:10', name: '2cool4shoes', message: 'skill issue'},
        {timestamp: '00:10',  name: 'coolbeanie', message: ':('},
        {timestamp: '00:11',  name: 'fred', message: 'uwu'},

    ];
   
    msgList.forEach((user) => {
        chatbox.push(
            <><p>[{user.timestamp}] <strong>{user.name}:  </strong>{user.message}</p></>
        );
    });

    return (
        <>
        <h4 style={{borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin"}}>Chat Name</h4>
        <div className="chatDiv" style={{overflowY: "scroll", width: "500px", height: "400px", padding: "10px", float:"left", borderStyle : "inset", borderColor:"rgb(195,196,200)", borderWidth: "thin", flex:1, lineHeight: "normal", backgroundColor: "white"}}>
            {chatbox}
        </div>
        </>

    )
}