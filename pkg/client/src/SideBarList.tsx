import React, {useContext, useEffect, useState} from "react";
import { Dropdown } from "react-bootstrap";
import { UserContext } from "./UserContext";

// TODO
// - import dynamic friend list. get offline/online
// get dynamic server list, connected server, online and offline servers. 
// - click on server to connect
// 

export type SideBarListProps = {
    setGroupID: (id: number) => void;
    setIsVisible: (isVisible: number) => void;
}
export function SideBarList(props: SideBarListProps) {
    const {groups, servers} = useContext(UserContext) || {} as UserContext;
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
   
    groups.forEach((group, index) => {
        groupList.push(
            <Dropdown.Item as="p" className="clickable" key={index} eventKey={index}
                           onClick={() => {
                               props.setGroupID(index);
                               props.setIsVisible(0)}}
            >group: {index}</Dropdown.Item>
        );
    });

    const groupCounter = groups.length;


    /////// SERVERS //////////
    let connectedServer: React.ReactElement[] = []
    let onlineServerList: React.ReactElement[] = []
    let offlineServerList: React.ReactElement[] = []


   // if user is online, add to one list, otherwise, add to another
    servers.forEach((server, index) => {
        // if status true
        if (index === 0) {
            connectedServer.push(
                <Dropdown.Item as="p" key={index}>● [<strong>{server}</strong>]</Dropdown.Item>
            );
        } else if (server){
            onlineServerList.push(
                <Dropdown.Item as="p" key={index}>● {server}</Dropdown.Item>
            );
        } else {
            offlineServerList.push(
                <Dropdown.Item as="p" key={index}>◌  {server}</Dropdown.Item>
            );
        }
    });
  
    return <>
            <button onClick={() => props.setIsVisible(4)}>Public Broadcasts</button>
            <h4 className="heading">Chats: {groupCounter} <button onClick={() => props.setIsVisible(1)}>+</button></h4>
            <div className="sidebarSubDiv">
                {groupList}
            </div>
            <h4 className="heading" >Friend List: {friendList.length} <button onClick={() => props.setIsVisible(2)}>+</button></h4>
            <div className="sidebarSubDiv">
                <h4 className="heading">Online: {userDisplayOnline.length}</h4>
                {userDisplayOnline}
                <h4 className="heading">Offline: {userDisplayOffline.length}</h4>
                {userDisplayOffline}
            </div>
            <h4 className="heading">Server List: {servers.length} <button onClick={() => props.setIsVisible(3)}>+</button></h4>
            <div className="sidebarSubDiv">
                <h4 >Online: {userDisplayOnline.length}</h4>
                {connectedServer}
                {onlineServerList}
                <h4 className="heading">Offline: {userDisplayOffline.length}</h4>
                {offlineServerList}
            </div>
            <button onClick={() => props.setIsVisible(5)}>Pat Baba</button>
        </>
}