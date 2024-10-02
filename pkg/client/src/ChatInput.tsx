import React, {useState} from "react";

export type ChatInputProps = {
    onSubmit: (message: string) => void;
}
export function ChatInput(props: ChatInputProps) {

    const [message, setMessage] = useState("");

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        console.log("Sent message " + message);

        props.onSubmit(message);
        setMessage("");
    }

    return <>
        <form onSubmit={onSubmit}>
            <input type="text" className="chatInputBox" name="messageText" value={message} onChange={(e) => setMessage(e.target.value)}/>
            <button type="submit" className="chatInputButton" name="submit">Send</button>
        </form>
        <button type="submit" className="chatInputButton">Attach File</button>
    </>
}