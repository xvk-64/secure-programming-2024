import React, {useContext, useEffect, useState} from "react";
import {ClientContext} from "../context/ClientContext.js";
import {GroupsMenu} from "./Chat/GroupsMenu.js";
import {Message, MessageGroups, MessageWindow} from "./Chat/MessageWindow.js";
import {PublicChat, Chat} from "@sp24/common/chatclient/ChatClient.js";
import {CleartextChat} from "@sp24/common/messageTypes.js";
import {MessageBox} from "./Chat/MessageBox.js";
import {UserPicker} from "./Chat/UserPicker.js";

export type ChatProps = {

}

export function Chat(props: ChatProps) {
    const clientContext = useContext(ClientContext);

    const [fingerprint, setFingerprint] = useState("");
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const [selectedGroupID, setSelectedGroupID] = useState("");
    const [allGroupIDs, setAllGroupIDs] = useState<string[]>([]);
    function onSelectGroupID(groupID: string) {
        setSelectedGroupID(groupID);
    }

    const [messageGroups, setMessageGroups] = useState<MessageGroups>(new Map([["", []]]))

    // On client update
    useEffect(() => {
        const clientUpdateListener = clientContext?.current?.client.onClientUpdate.createListener(() => {
            setFingerprint(clientContext?.current?.client.fingerprint || "");

            setOnlineUsers(clientContext?.current?.client.getOnlineClients().map(c => c.fingerprint).filter(f => f != fingerprint) || []);
        });

        // Fingerprint and online users are already available as client is already logged in.
        setFingerprint(clientContext?.current?.client.fingerprint || "");
        setOnlineUsers(clientContext?.current?.client.getOnlineClients().map(c => c.fingerprint).filter(f => f != fingerprint) || []);

        // Cleanup
        return () => {
            if (clientUpdateListener !== undefined)
                clientContext?.current?.client.onClientUpdate.removeListener(clientUpdateListener);
        }
    }, [allGroupIDs]);

    // On public chat
    useEffect(() => {
        const publicChatListener = clientContext?.current?.client.onPublicChat.createListener(data => {
            setMessageGroups(mg => new Map(mg.set("", [...mg.get("")!, {
                senderFingerprint: data.senderFingerprint,
                text: data.message,
                key: crypto.randomUUID()
            }])));
        })

        // Cleanup
        return () => {
            if (publicChatListener !== undefined)
                clientContext?.current?.client.onPublicChat.removeListener(publicChatListener);
        }
    }, []);

    // On chat
    useEffect(() => {
        const chatListener = clientContext?.current?.client.onChat.createListener(data => {
            if (!allGroupIDs.includes(data.groupID))
                setAllGroupIDs([...allGroupIDs, data.groupID]);
            if (!(messageGroups.has(data.groupID)))
                setMessageGroups(mg => new Map(mg.set(data.groupID, [])));

            setMessageGroups(mg => new Map(mg.set(data.groupID, mg.get(data.groupID)!.concat({
                senderFingerprint: data.senderFingerprint,
                text: data.message,
                key: crypto.randomUUID()
            }))));
        });

        // Cleanup
        return () => {
            if (chatListener !== undefined)
                clientContext?.current?.client.onChat.removeListener(chatListener);
        }
    }, [allGroupIDs, messageGroups]);

    function onSendMessage(messageText: string) {
        if (selectedGroupID === "") {
            clientContext?.current?.client.sendPublicChat(messageText);
        } else {
            clientContext?.current?.client.sendChat(messageText, selectedGroupID);
        }

        const message: Message = {
            senderFingerprint: fingerprint,
            text: messageText,
            key: crypto.randomUUID()
        };

        setMessageGroups(mg => new Map(mg).set(selectedGroupID, (mg.has(selectedGroupID) ? mg.get(selectedGroupID)! : []).concat(message)));
    }

    function onGroup(groupID: string) {
        console.log(groupID)

        if (!allGroupIDs.includes(groupID))
            setAllGroupIDs([...allGroupIDs, groupID]);
    }

    return (
        <>
            <span>Logged in as {fingerprint}</span>
            <GroupsMenu selectedGroupID={selectedGroupID} allGroupIDs={allGroupIDs} onSelectGroupID={onSelectGroupID} />
            <UserPicker onlineUsers={onlineUsers} onGroup={onGroup}/>
            <MessageBox onSendMessage={onSendMessage}/>
            <MessageWindow messages={messageGroups.get(selectedGroupID) || []} />
        </>
    )
}