import React, {useContext, useState} from "react";
import { ChatContext } from "./ChatContext.js";

export type ChatInputProps = {
    groupId: string,
}
export function ChatInput(props: ChatInputProps) {
    const {sendChat} = useContext(ChatContext) || {} as ChatContext;
    const [message, setMessage] = useState("");

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        sendChat(props.groupId, message);
    }

    return <>
        <form onSubmit={onSubmit}>
            <input type="text" className="chatInputBox" name="messageText" value={message} onChange={(e) => setMessage(e.target.value)}/>
            <button type="submit" className="chatInputButton" name="submit">Send</button>
        </form>
        <button type="submit" className="chatInputButton">Attach File</button>
    </>
}