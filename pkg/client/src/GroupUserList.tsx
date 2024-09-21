import React, {useEffect, useState} from "react";



export default function GroupUserList() {
    let userDisplayOnline: React.ReactElement[] = []
    let userDisplayOffline: React.ReactElement[] = []
    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const userList = [
        {name: 'fred', online:true},
        {name: 'jamie', online:true},
        {name: 'cat', online:false},
    ];
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
    

    return (
        <>
        <h4>Group Chat Members:</h4>
        <h4>Online:</h4>
        {userDisplayOnline}
        <h4>Offline:</h4>
        {userDisplayOffline}
        </>
    )
}