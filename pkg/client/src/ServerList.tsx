import React, {useContext, useEffect, useState} from "react";
import { UserContext } from "./UserContext";



export function ServerList() {
    let connectedServer: React.ReactElement[] = []
    let onlineServerList: React.ReactElement[] = []
    let offlineServerList: React.ReactElement[] = []

    const {servers} = useContext(UserContext) || {} as UserContext;

   // if user is online, add to one list, otherwise, add to another
    servers.forEach((server, index) => {
        // if status true
        if (index === 0) { // bludge: assume you are connected to the first server
            connectedServer.push(
                <>
                <p key={index}>● [<strong>{server}</strong>]</p>
                </>)
            } else if (server){ // we don't have a way of telling implemented
                onlineServerList.push(
                    <><p key={index}>● {server}</p></>)
            } else {
                offlineServerList.push(
                    <><p key={index}>◌  {server}</p></>)
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
        {/* <h4 className="heading" style={{borderStyle : "ridge", borderColor:"rgb(195,196,200)", borderWidth: "thin"}}>Servers:   <button type="submit" >+</button></h4> */}
        
        {connectedServer}
        {/* <p>---------</p> */}
        {onlineServerList}
        {offlineServerList}
        </>
    )
}