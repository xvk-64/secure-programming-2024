import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "./UserContext";


// TODO:
// - make it dynamic for each group
// - query online list/offline list
// - if fingerprint in friend list, display nickname

export type GroupUserListProps = {
    isVisible: number;
    groupId: number,
}
export function GroupUserList(props: GroupUserListProps) {
    let userDisplayOnline: React.ReactElement[] = []
    let userDisplayOffline: React.ReactElement[] = []

    const {groups} = useContext(UserContext) || {} as UserContext;
    
    // if user is online, add to one list, otherwise, add to another
    groups[props.groupId]?.groupInfo.users.forEach((user, index) => {
        // if status true
        if(true) {
            userDisplayOnline.push(<p key={index}>● <strong>{user}</strong></p>);
        } else {
            userDisplayOffline.push(<p key={index}>◌ {user}</p>); 
        }
    });
    // let userDisplay: React.ReactElement[] = [...userDisplayOnline, ...userDisplayOffline]

    return <>
        {props.isVisible == 0 && (
            <div className="rightDiv">
            <h4 className="heading">Group Chat Members:</h4>
            <h4 className="heading">Online: {userDisplayOnline.length}</h4>
            {userDisplayOnline}
            <h4 className="heading">Offline: {userDisplayOffline.length}</h4>
            {userDisplayOffline}
            </div>
        )}
    </>
}