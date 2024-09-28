import React, {useEffect, useState} from "react";
import ChatInput from "./ChatInput.js";


// TODO
// - dynamically load in messages
// - refresh automatically on new message received/sent
// - send message logic
// - send file logic

export default function ChatBox({groupList, groupID}) {
    let chatbox: React.ReactElement[] = []
    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const msgList = groupList[groupID];

    msgList.forEach((user) => {
        chatbox.push(
            <><p>[{user.timestamp}] <strong>{user.name}:  </strong>{user.message}</p></>
        );
    });

    return (
        <>
        <h4 className="heading">Group {groupID}</h4>
        <div className="chatDiv">
            {chatbox}
            
        </div>
        <ChatInput></ChatInput>
        </>

    )
}