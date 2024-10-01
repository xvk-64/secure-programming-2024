import { PEMToKey } from "@sp24/common/util/crypto.js";
import React, { createContext, useEffect, useState } from "react";

export interface GroupInfo {
    users: string[],
    fingerprint: string,
}

type ChatMessage = {
    sender: string,
    message: string,
}

export interface Group {
    groupInfo: GroupInfo,
    chatLog: ChatMessage[],
}

export interface User {
    // the user's keys
    privKeyPEM: string,
    pubKeyPEM: string,
    // the user's friends map
    friends: Map<string, string>,
    // the user's groups (with chat logs)
    groups: Group[],
    publicGroup: {sender: string, message: string}[],
    // the user's known servers
    servers: string[],
}

export type UserContext = {
    exists: boolean,
    privKeyPEM: string | null,
    pubKeyPEM: string | null,
    setUser: (user: User) => void,
    friends: Map<string, string>,
    updateFriend: (publicKey: string, newUsername: string) => void,
    removeFriend: (publicKey: string) => void,
    groups: Group[],
    addGroup: (group: Group) => void,
    appendMessage: (groupIndex: number, sender: string, message: string) => void,
    appendPublicMessage: (sender: string, message: string) => void,
    servers: string[],
    addServer: (server: string) => void,
}

// TODO: map out this type
export const UserContext: React.Context<UserContext | null> = createContext<UserContext | null>(null);

// TODO: what is this type?
export const UserProvider = ({ children }: any) => {
    const [loaded, setLoaded] = useState(false);
    const [exists, setExists] = useState(false);

    const [friends, setFriends] = useState(new Map<string, string>());
    const updateFriend = (publicKey: string, newUsername: string) => {
        setFriends(prevFriends => {
            const newMap = new Map(prevFriends);
            newMap.set(publicKey, newUsername);
            return newMap;
        });
    } // check for name collision
    const removeFriend = (publicKey: string) => {
        setFriends(prevFriends => {
            const newMap = new Map(prevFriends);
            newMap.delete(publicKey);
            return newMap;
        });
    }
    
    const [groups, setGroups] = useState<Group[]>([]);
    const addGroup = (group: Group) => {
        setGroups(prevGroups => [...prevGroups, group])
    }
    const appendMessage = (groupIndex: number, sender: string, message: string) => {
        const newGroups = groups.slice();
        newGroups[groupIndex].chatLog.push({sender, message});
        setGroups(newGroups);
    }
    const [publicGroup, setPublicGroup] = useState<ChatMessage[]>([]);
    const appendPublicMessage = (sender: string, message: string) => {
        setPublicGroup([...publicGroup, {sender, message}]);
    }
    
    const [servers, setServers] = useState<string[]>([]);
    const addServer = (server: string) => {
        setServers(prevServers => [...prevServers, server])
    }
    
    const [privKeyPEM, setPrivKeyPEM] = useState<string | null>(null);
    const [pubKeyPEM, setPubKeyPEM] = useState<string | null>(null);

    const setUser = (user: User) => {
        setPrivKeyPEM(user.privKeyPEM);
        setPubKeyPEM(user.pubKeyPEM);
        setFriends(user.friends);
        setGroups(user.groups);
        setServers(user.servers);
    }

    // then initialise it by checking the localstorage
    useEffect(() => {
        const localPrivKey = localStorage.getItem("privKey");
        const localPubKey = localStorage.getItem("pubKey");
        if(localPrivKey && localPubKey) {
            setPrivKeyPEM(localPrivKey);
            setPubKeyPEM(localPubKey);
            let localFriends = localStorage.getItem("friends");
            if(localFriends) {setFriends(new Map(Object.entries(JSON.parse(localFriends))));}
            let localGroups = localStorage.getItem("groups");
            if(localGroups) {setGroups(JSON.parse(localGroups));}
            let localPublicGroup = localStorage.getItem("publicGroup");
            if(localPublicGroup) {setGroups(JSON.parse(localPublicGroup));}
            let localServers = localStorage.getItem("servers");
            if(localServers) {setServers(JSON.parse(localServers));}
            setExists(true);
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if(loaded)
            localStorage.setItem("friends", JSON.stringify(friends));
    }, [friends, loaded]);
    useEffect(() => {
        if(loaded)
            localStorage.setItem("groups", JSON.stringify(groups));
    }, [groups, loaded]);
    useEffect(() => {
        if(loaded)
            localStorage.setItem("publicGroup", JSON.stringify(publicGroup));
    }, [publicGroup, loaded]);
    useEffect(() => {
        if(loaded)
            localStorage.setItem("servers", JSON.stringify(servers));
    }, [servers, loaded]);
    useEffect(() => {
        if(loaded && privKeyPEM)
            localStorage.setItem("privKey", privKeyPEM);
    }, [privKeyPEM, loaded]);
    useEffect(() => {
        if(loaded && pubKeyPEM)
            localStorage.setItem("privKey", pubKeyPEM);
    }, [privKeyPEM, loaded]);

    const ret = {
        exists,
        privKeyPEM,
        pubKeyPEM,
        setUser,
        friends,
        updateFriend,
        removeFriend,
        groups,
        addGroup,
        appendMessage,
        appendPublicMessage,
        servers,
        addServer,
    };
    return <UserContext.Provider value={ret}>
        {children}
    </UserContext.Provider>
}