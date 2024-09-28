import React, {useEffect, useState} from "react";


// TODO:
// - make it dynamic for each group
// - query online list/offline list
// - if fingerprint in friend list, display nickname
export default function GroupUserList({isVisible}) {
    let userDisplayOnline: React.ReactElement[] = []
    let userDisplayOffline: React.ReactElement[] = []
    
    const userList = [
        {name: 'fred', online:true},
        {name: 'jamie', online:true},
        {name: 'cat', online:false},
    ];

    let onlineCounter = 0;
    let offlineCounter = 0;

   // if user is online, add to one list, otherwise, add to another
    userList.forEach((user) => {
        // if status true
        {user.online ? (
            userDisplayOnline.push(
                <><p>● <strong>{user.name}</strong></p></>)
            ): ( // else if false
                userDisplayOffline.push(
                    <><p>◌ {user.name}</p></>)
                    
        )}
       
    });
    // let userDisplay: React.ReactElement[] = [...userDisplayOnline, ...userDisplayOffline]
    userList.forEach((user) => {
        {user.online ? (
            onlineCounter += 1
            ): ( // else if false
                offlineCounter += 1
        )}
    })

    return (
        <>
            {isVisible == 0 && (
            <>
            <div className="rightDiv">
            <h4 className="heading">Group Chat Members:</h4>
            <h4 className="heading">Online: {onlineCounter}</h4>
            {userDisplayOnline}
            <h4 className="heading">Offline: {offlineCounter}</h4>
            {userDisplayOffline}
            </div>
            </>
            )}

    </>
    )
}