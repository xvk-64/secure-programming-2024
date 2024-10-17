import React, {FormEvent, useState} from "react"
import {FileUpload} from "./FileUpload.js";

export type MessageBoxProps = {
    onSendMessage: (message: string) => void;
}

export function MessageBox (props: MessageBoxProps) {
    const [message, setMessage] = useState("");

    const onSend: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        if (message === "")
            // Don't send empty message
            return;

        props.onSendMessage(message);
        setMessage("");
    }

    const onUploadDone = (URL: string) => {
        setMessage(URL);
    }

    return <>
        <FileUpload onUploadDone={onUploadDone}/>
        <form onSubmit={onSend}>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
            <input type="submit" value="Send"/>
        </form>
    </>
}