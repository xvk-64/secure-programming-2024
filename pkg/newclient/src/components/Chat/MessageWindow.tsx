import React from "react";
import {MessageElement} from "./MessageElement.js";

export type Message = {
    text: string;
    senderFingerprint: string;
    key: string;
}

export type MessageGroups = Map<string, Message[]>;
export type MessageWindowProps = {
    selectedGroupID: string;
    messageGroups: MessageGroups;
}

export function MessageWindow(props: MessageWindowProps) {
    return (
        <>
            <div>
                {(props.messageGroups.get(props.selectedGroupID)?.map(message =>
                    <MessageElement key={message.key} message={message} />
                ))}
            </div>
        </>
    )
}