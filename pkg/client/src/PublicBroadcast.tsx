import React, {useEffect, useState} from "react";
import ChatInput from "./ChatInput.js";
import PublicBroadcastInput from "./PublicBroadcastInput.js";


// TODO
// - broadcast message unencrypted to all clients
// - log messages

export default function PublicBroadcast() {
    let sentMessages: React.ReactElement[] = []
    let msgList = ["wowowowoww", "cool message bro", "i like soup"];
 

    msgList.forEach((message) => {
        sentMessages.push(
            <><p>{message}</p></>
        );
    });

    return (
        <>
        <h4 className="heading">Public Broadcast</h4>
        <div className="chatDiv">
            <p>Will send an unencrypted message to ALL connected clients. Careful!</p><br/>
            <p>Messages recently broadcast:</p>
            <div className="broadcastDiv">
                {sentMessages}
            </div>
            
            
        </div>
        <PublicBroadcastInput></PublicBroadcastInput>
        </>

    )
}