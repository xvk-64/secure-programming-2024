import React, {useEffect, useState} from "react";
import { Dropdown } from 'react-bootstrap';
import ServerList from "./ServerList.js";
import CreateGroupChat from "./CreateGroupChat.js";

// TODO
// - import dynamic friend list. get offline/online
// get dynamic server list, connected server, online and offline servers. 
// - click on server to connect
// 

export default function SideBarList({setGroupID, setIsVisible}) {

    ////////// FRIEND LIST ////////////
    let userDisplayOnline: React.ReactElement[] = []
    let userDisplayOffline: React.ReactElement[] = []
    
    const friendList = [
        {name: 'fred', online:true},
        {name: 'jamie', online:true},
        {name: 'cat', online:false},
    ];

    // if user is online, add to one list, otherwise, add to another
    friendList.forEach((user, index) => {
        if(user.online) {
            userDisplayOnline.push(
                <Dropdown.Item as="p" key={index}>● <strong>{user.name}</strong></Dropdown.Item>
            );
        } else {
            userDisplayOffline.push(
                <Dropdown.Item as="p" key={index}>◌ {user.name}</Dropdown.Item>
            );
        }
    });

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
            <Dropdown.Item as="p" className="clickable" key={index} eventKey={index} onClick={() => setGroupID(group.groupID) & setIsVisible(0)}>{group.groupName}</Dropdown.Item>
        );
    });

    const groupCounter = groupsOriginal.length;


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
    userServerList.forEach((server, index) => {
        // if status true
        if (server.connected) {
            connectedServer.push(
                <Dropdown.Item as="p" key={index}>● [<strong>{server.name}</strong>]</Dropdown.Item>
            );
        } else if (server.online){
            onlineServerList.push(
                <Dropdown.Item as="p" key={index}>● {server.name}</Dropdown.Item>
            );
        } else {
            offlineServerList.push(
                <Dropdown.Item as="p" key={index}>◌  {server.name}</Dropdown.Item>
            );
        }
    });
  
    return <>
            <button onClick={() => setIsVisible(4)}>Public Broadcasts</button>
            <h4 className="heading">Chats: {groupCounter} <button onClick={() => setIsVisible(1)}>+</button></h4>
            <div className="sidebarSubDiv">
                {groupList}
            </div>
            <h4 className="heading" >Friend List: {friendList.length} <button onClick={() => setIsVisible(2)}>+</button></h4>
            <div className="sidebarSubDiv">
                <h4 className="heading">Online: {userDisplayOnline.length}</h4>
                {userDisplayOnline}
                <h4 className="heading">Offline: {userDisplayOffline.length}</h4>
                {userDisplayOffline}
            </div>
            <h4 className="heading">Server List: {userServerList.length} <button onClick={() => setIsVisible(3)}>+</button></h4>
            <div className="sidebarSubDiv">
                <h4 >Online: {userDisplayOnline.length}</h4>
                {connectedServer}
                {onlineServerList}
                <h4 className="heading">Offline: {userDisplayOffline.length}</h4>
                {offlineServerList}
            </div>
            <button onClick={() => setIsVisible(5)}>Pat Baba</button>
        </>
}