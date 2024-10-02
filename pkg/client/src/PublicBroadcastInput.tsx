import React, {useContext, useEffect, useState} from "react";
import { ChatContext } from "./ChatContext";

// TODO
// - send unencrypted message to all clients
export function PublicBroadcastInput() {
    const {sendPublicChat} = useContext(ChatContext) || {} as ChatContext;
    const [message, setMessage] = useState("");

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        sendPublicChat(message);
    }
    return (
        <>
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" className="chatInputBox" name="messageText" value={message} onChange={(e) => setMessage(e.target.value)}/>
                <button type="submit" className="chatInputButton" name="submit">Send</button>
            </form>
            <button type="submit" className="chatInputButton">Attach File</button>
        </div>
        </>
    )
}