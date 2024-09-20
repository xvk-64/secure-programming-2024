import React, {useEffect, useState} from "react";


export default function ChatBox() {
    let chatbox: React.ReactElement[] = []
    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const msgList = [
        {timestamp: '00:00',  name: 'fred', message: 'wowowowowowowowoww'},
        {timestamp: '00:05', name: 'coolbeanie', message: 'supermarket is full rn, lots of cats'},
        {timestamp: '00:10', name: '2cool4trains', message: 'i like soup'},

    ];
   
    msgList.forEach((user) => {
        chatbox.push(
            <><p>[{user.timestamp}] <strong>{user.name}:  </strong>{user.message}</p></>
        );
    });

    return (
        <>{chatbox}</>
    )
}