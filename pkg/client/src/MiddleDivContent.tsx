import React, {useEffect, useState} from "react";

import ChatBox from "./ChatBox.js";
import GroupChatList from "./GroupChatList.js";
import DropDownMenus from "./DropDownMenus.js";
import SideBarList from "./SideBarList.js";
import CreateGroupChat from "./CreateGroupChat.js";
import AddServer from "./AddServer.js";
import GroupUserList from "./GroupUserList.js";

// TODO
// - friend list/ add friend button/screen

// switches content in the middle div depending on use state
const msgList = [
    [{timestamp: '00:00',  name: 'fred', message: 'wowowowowowowowoww'},
    {timestamp: '00:05', name: 'coolbeanie', message: 'hey guys can you help im stuck in the void'},
    {timestamp: '00:10', name: '2cool4shoes', message: 'skill issue'}],
    [{timestamp: '00:10',  name: 'coolbeanie', message: ':('},
    {timestamp: '00:11',  name: 'fred', message: 'uwu'}]
];

// const [showChat setShowChat] = useState()

export default function MiddleDivContent({groupID, isVisible}) {
    

    return (
    <>
        {isVisible == 0 && (
            <>
            <ChatBox groupList={msgList} groupID={groupID}></ChatBox>
            
            </>
            
        )}
        
        {isVisible == 1 && (
         
            <CreateGroupChat></CreateGroupChat>
            
        )}

      

        {isVisible == 3 && (
            <span>
            
            </span>
        )}

        {isVisible == 3 && (
           
            <AddServer></AddServer>
           
        )}


    </>
    )
}