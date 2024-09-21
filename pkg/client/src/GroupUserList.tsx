import React, {useEffect, useState} from "react";



export default function GroupUserList() {
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
        <h4 style={{display: "flex", borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin"}}>Group Chat Members:</h4>
        <h4 style={{display: "flex", flexWrap: "wrap", borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin"}}>Online: {onlineCounter}</h4>
        {userDisplayOnline}
        <h4 style={{borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin"}}>Offline: {offlineCounter}</h4>
        {userDisplayOffline}
        </>
    )
}