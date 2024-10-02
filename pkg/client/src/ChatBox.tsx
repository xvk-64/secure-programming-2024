import React, {useContext, useEffect, useState} from "react";
import { ChatInput } from "./ChatInput.js";
import { UserContext } from "./UserContext.js";


// TODO
// - dynamically load in messages
// - refresh automatically on new message received/sent
// - send message logic
// - send file logic

export default function ChatBox({groupID}) {
    const {friends, groups} = useContext(UserContext) || {} as UserContext;
    const msgList = groups[groupID]?.chatLog;

    let chatbox: React.ReactElement[] = [];
    msgList?.forEach((message, index) => {
        const name = friends.get(message.sender) ? friends.get(message.sender) : message.sender;
        chatbox.push(
            <p key={index}><strong>{name}:  </strong>{message.message}</p>
        );
    });

    return <>
        <h4 className="heading">Group {groupID}</h4>
        <div className="chatDiv">
            {chatbox}
        </div>
        <ChatInput groupId={groupID}></ChatInput>
    </>
}