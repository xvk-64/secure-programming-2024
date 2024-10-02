import React, {useEffect, useState} from "react";

// TODO
// - send unencrypted message to all clients
export function PublicBroadcastInput() {

    return (
        <>
        <div>
            <button type="submit" className="chatInputButton">Attach File</button>
            <input type="text" className="chatInputBox"/>
            <button type="submit" className="chatInputButton">Send</button>
        </div>
        </>
    )
}