import React, {useEffect, useState} from "react";



export default function GroupUserList() {
    let userDisplayOnline: React.ReactElement[] = []
    let userDisplayOffline: React.ReactElement[] = []
    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const userList = [
        {name: 'fred', status:true},
        {name: 'jamie', status:false},
        {name: 'cat', status:true},
    ];
   
    userList.forEach((user) => {
        // if status true
        {user.status ? (
            userDisplayOnline.push(
                <><p>● <strong>{user.name}</strong></p></>)
            ): ( // else if false
                userDisplayOffline.push(
                    <><p>◌ {user.name}</p></>)
        )}
       
    });
    let userDisplay: React.ReactElement[] = [...userDisplayOnline, ...userDisplayOffline]
    

    return (
        <>
        <h3>Group Chat Members:</h3>
        <h4>Online:</h4>
        {userDisplayOnline}
        <h4>Offline:</h4>
        {userDisplayOffline}
        </>
    )
}