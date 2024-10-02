import React, {useEffect, useState} from "react";


// TODO:
// - make it dynamic for each group
// - query online list/offline list
// - if fingerprint in friend list, display nickname

export type GroupUserListProps = {
    isVisible: number;
}
export function GroupUserList(props: GroupUserListProps) {
    let userDisplayOnline: React.ReactElement[] = []
    let userDisplayOffline: React.ReactElement[] = []
    
    const userList = [
        {name: 'fred', online:true},
        {name: 'jamie', online:true},
        {name: 'cat', online:false},
    ];

   // if user is online, add to one list, otherwise, add to another
    userList.forEach((user, index) => {
        // if status true
        if(user.online) {
            userDisplayOnline.push(<p key={index}>● <strong>{user.name}</strong></p>);
        } else {
            userDisplayOffline.push(<p key={index}>◌ {user.name}</p>); 
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