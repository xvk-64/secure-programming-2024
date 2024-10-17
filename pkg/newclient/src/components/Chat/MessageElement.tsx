import React from "react";
import {Message} from "./MessageWindow.js";

export type MessageElementProps = {
    message: Message;
}

export function MessageElement(props: MessageElementProps) {
    return (
        <div>
            <strong>{props.message.senderFingerprint}:</strong>
            <span> {props.message.text}</span>
        </div>
    )
}