import React, { ReactElement, useContext, useState } from 'react'
import {UserContext} from "./UserContext.js";
import {ChatContext} from "./ChatContext.js";


export default function ChatBox(){
    const {groups} = useContext(UserContext) || {} as UserContext;
    const {sendChat} = useContext(ChatContext) || {sendChat: (group, message) => {}, online: {"you":"server"}};
    const [groupId, setGroupId] = useState(0);
    const [message, setMessage] = useState("");
    const [groupIdDraft, setGroupIdDraft] = useState("");
    const messages: ReactElement[] = groups[groupId]?.chatLog ? groups[groupId].chatLog.reduce(
        (acc: ReactElement[], {sender, message}, index) => [...acc, <p key={index}>{sender}: {message}</p>], []) : [<p key={0}>No messages</p>];
    const idInput = <input type="text" onChange={(event) => {setGroupIdDraft(event.target.value)}}></input>
    const messageInput = <input type="text" onChange={(event) => {setMessage(event.target.value)}}></input>
    return <>
        {idInput}
        <button onClick={() => {setGroupId(Number(groupIdDraft));}}>groupId</button>
        {messageInput}
        <button onClick={() => {sendChat(groupId, message); console.log(message);}}>message</button>
        {messages}
    </>
}