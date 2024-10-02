import React, {useEffect, useState} from "react";
import {ChatInput} from "./ChatInput.js";


// TODO
// - dynamically load in messages
// - refresh automatically on new message received/sent
// - send message logic
// - send file logic

export type ChatBoxProps = {
    groupID: string;
}
export function ChatBox(props: ChatBoxProps) {


    // const msgList = groupList[groupID];

    // msgList.forEach((user, index) => {
    //     chatbox.push(
    //         <p key={index}>[{user.timestamp}] <strong>{user.name}:  </strong>{user.message}</p>
    //     );
    // });

    const onSendMessage = (message: string) => {

    }

    return <>
        <h4 className="heading">Group {props.groupID}</h4>
        <div className="chatDiv">
            {/*{chatbox}*/}
        </div>
        <ChatInput onSubmit={onSendMessage}></ChatInput>
    </>
}