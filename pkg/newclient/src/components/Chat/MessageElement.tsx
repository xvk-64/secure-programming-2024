import React from "react";
import {Message} from "./MessageWindow.js";

export type MessageElementProps = {
    message: Message;
}

// Activate vulnerability HTML Injection
const useHTMLInjection = false;

export function MessageElement(props: MessageElementProps) {
    if (useHTMLInjection) {
        return (
            <div>
                <strong>{props.message.senderFingerprint}</strong>:
                <span dangerouslySetInnerHTML={{__html: props.message.text}}></span>
            </div>
        )
    } else {
        return (
            <div>
                <strong>{props.message.senderFingerprint}</strong>:
                <span>{props.message.text}</span>
            </div>
        )
    }
}
