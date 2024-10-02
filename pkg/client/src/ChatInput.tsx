import React from "react";


export default function ChatInput() {
    function submitMessage(text: string) {
        if(text !== "")
            console.log("sent message: " + text);
    }
    return <>
        <form onSubmit={(event) => {event.preventDefault();submitMessage(event.target[0].value);}}>
            <input type="text" className="chatInputBox" name="messageText"/>
            <button type="submit" className="chatInputButton" name="submit">Send</button>
        </form>
        <button type="submit" className="chatInputButton">Attach File</button>
    </>
}