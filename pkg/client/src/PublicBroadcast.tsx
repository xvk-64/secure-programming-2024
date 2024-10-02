import React, {useContext, useEffect, useState} from "react";
import {PublicBroadcastInput} from "./PublicBroadcastInput.js";
import { UserContext } from "./UserContext.js";


// TODO
// - broadcast message unencrypted to all clients
// - log messages

export function PublicBroadcast() {
    const {publicGroup} = useContext(UserContext) || {} as UserContext;
    let sentMessages: React.ReactElement[] = []
 

    publicGroup.forEach((message, index) => {
        sentMessages.push(
            <p key={index}>{message.sender}: {message.message}</p>
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