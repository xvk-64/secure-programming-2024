import React, {useEffect, useState} from "react";



export default function ServerList() {
    let connectedServer: React.ReactElement[] = []
    let onlineServerList: React.ReactElement[] = []
    let offlineServerList: React.ReactElement[] = []

    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const userServerList = [
        {name: 'abcdc12', online:true, connected:false},
        {name: 'zyx256', online:false, connected:false},
        {name: 'fhds42', online:true, connected:true},
    ];
   // if user is online, add to one list, otherwise, add to another
    userServerList.forEach((server) => {
        // if status true
        if (server.connected) {
            connectedServer.push(
                <>
                <p>● [<strong>{server.name}</strong>]</p>
                </>)
            } else if (server.online){
                onlineServerList.push(
                    <><p>● {server.name}</p></>)
            } else {
                offlineServerList.push(
                    <><p>◌  {server.name}</p></>)
            }
    });
    // let userDisplay: React.ReactElement[] = [...userDisplayOnline, ...userDisplayOffline]
    
    // {server.connected ? (
    //     serverList.push(
    //         <>
    //         <h4>Connected:</h4>
    //         <p>● <strong>{server.name}</strong></p>
    //         </>)
    //     ):({!server.connected && server.online ? (
    //         serverList.push(
    //             <><p>● {server.name}</p></>)
    //     ): (
    //         serverList.push(
    //             <><p>◌  {server.name}</p></>)
    //     )
    // })}

{/* <div style={{width:"200px", height:"30px", borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin"}}></div> */}
    return (
        <>
        <h4 style={{borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin"}}>Servers:</h4>
        
        {connectedServer}
        {/* <p>---------</p> */}
        {onlineServerList}
        {offlineServerList}
        </>
    )
}