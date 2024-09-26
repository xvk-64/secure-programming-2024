import React, {useEffect, useState} from "react";


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
        <h4 className="heading">Chat Name</h4>
        <div className="chatDiv">
            {chatbox}
        </div>
        </>

    )
}