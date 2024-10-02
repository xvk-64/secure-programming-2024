import React, {useContext, useEffect, useState} from "react";
import {ClientContext} from "../context/ClientContext.js";
import {GroupsMenu} from "./Chat/GroupsMenu.js";
import {MessageGroups, MessageWindow} from "./Chat/MessageWindow.js";
import {PublicChat} from "@sp24/common/chatclient/ChatClient.js";

export type ChatProps = {

}

export function Chat(props: ChatProps) {
    const client = useContext(ClientContext);

    const [fingerprint, setFingerprint] = useState("");

    function onClientUpdate() {
        setFingerprint(client?.current?.fingerprint || "");
    }

    useEffect(() => {
        const clientUpdateListener = client?.current?.onClientUpdate.createListener(onClientUpdate);
        const publicChatListener = client?.current?.onPublicChat.createListener(onPublicChat)

        // Run once
        onClientUpdate();

        // Cleanup
        return () => {
            if (clientUpdateListener !== undefined)
                client?.current?.onClientUpdate.removeListener(clientUpdateListener);
            if (publicChatListener !== undefined)
                client?.current?.onPublicChat.removeListener(publicChatListener);
        }
    }, []);

    const [selectedGroupID, setSelectedGroupID] = useState("");
    const allGroupIDs: string[] = ["A"];
    function onSelectGroupID(groupID: string) {
        setSelectedGroupID(groupID);
    }

    const [messageGroups, setMessageGroups] = useState<MessageGroups>(new Map([["", []]]))
    function onPublicChat(data: PublicChat) {
        console.log(data);
        setMessageGroups(mg => new Map(mg.set("", [...mg.get("")!, {
            senderFingerprint: data.senderFingerprint,
            text: data.message,
            key: crypto.randomUUID()
        }])));
    }

    return (
        <>
            <span>Logged in as {fingerprint}</span>
            <GroupsMenu selectedGroupID={selectedGroupID} allGroupIDs={allGroupIDs} onSelectGroupID={onSelectGroupID} />
            <MessageWindow selectedGroupID={selectedGroupID} messageGroups={messageGroups} />
        </>
    )
}