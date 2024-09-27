import React, {useEffect, useState} from "react";
import { Dropdown } from 'react-bootstrap';
import ServerList from "./ServerList.js";
import CreateGroupChat from "./CreateGroupChat.js";


export default function SideBarList({setGroupID, setIsVisible}) {

    ////////// FRIEND LIST ////////////
    let userDisplayOnline: React.ReactElement[] = []
    let userDisplayOffline: React.ReactElement[] = []
    
    const friendList = [
        {name: 'fred', online:true},
        {name: 'jamie', online:true},
        {name: 'cat', online:false},
    ];

    let onlineCounter = 0;
    let offlineCounter = 0;
    let friendCounter = 0;

   // if user is online, add to one list, otherwise, add to another
    friendList.forEach((user) => {
        // if status true
        {user.online ? (
            userDisplayOnline.push(
                <><Dropdown.Item as="p" className="clickable">● <strong>{user.name}</strong></Dropdown.Item></>)
            ): ( // else if false
                userDisplayOffline.push(
                    <><Dropdown.Item as="p" className="clickable">◌ {user.name}</Dropdown.Item></>)
                    
        )}
    });
    // let userDisplay: React.ReactElement[] = [...userDisplayOnline, ...userDisplayOffline]
    friendList.forEach((user) => {
        {user.online ? (
            onlineCounter += 1, friendCounter +=1
            ): ( // else if false
                offlineCounter += 1, friendCounter +=1
        )}
    })

    ////// GROUP CHATS //////////////
    
    let groupList: React.ReactElement[] = []
    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const groupsOriginal = [
        {groupID: 0, groupName: 'group1'},
        {groupID: 1, groupName: 'group2'},
        {groupID: 2, groupName: 'group4'},
    ];
   
    groupsOriginal.forEach((group, index) => {
        groupList.push(
          //  href="#/action-1">
            <><Dropdown.Item as="p" className="clickable" eventKey={index} onClick={() => setGroupID(group.groupID) & setIsVisible(0)}>{group.groupName}</Dropdown.Item></>
        );
    });

    let groupCounter = groupsOriginal.length;


    /////// SERVERS //////////
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
                <Dropdown.Item as="p" className="clickable">● [<strong>{server.name}</strong>]</Dropdown.Item>
                </>)
            } else if (server.online){
                onlineServerList.push(
                    <><Dropdown.Item as="p" className="clickable">● {server.name}</Dropdown.Item></>)
            } else {
                offlineServerList.push(
                    <><Dropdown.Item as="p" className="clickable">◌  {server.name}</Dropdown.Item></>)
            }
    });
    let serverCounter = userServerList.length;
  
    return (
        <>
        
        <div className="sidebarSubDiv">
        <h4 className="heading">Chats: {groupCounter} <button onClick={() => setIsVisible(1)}>+</button></h4>
            {groupList}
        </div>
        <div className="sidebarSubDiv">
        <h4 className="heading" >Friend List: {friendCounter} <button onClick={() => setIsVisible(2)}>+</button></h4>
        <h4 className="heading">Online: {onlineCounter}</h4>
        {userDisplayOnline}
        <h4 className="heading">Offline: {offlineCounter}</h4>
        {userDisplayOffline}
        </div>
        <div className="sidebarSubDiv">
        <h4 className="heading">Server List: {serverCounter} <button onClick={() => setIsVisible(3)}>+</button></h4>
        <h4 >Online: {onlineCounter}</h4>
        {connectedServer}
        {onlineServerList}
        <h4 className="heading">Offline: {offlineCounter}</h4>
        {offlineServerList}
        </div>
        </>
    )
}