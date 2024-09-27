import React, {useEffect, useState} from "react";

import ChatBox from "./ChatBox.js";
import GroupChatList from "./GroupChatList.js";
import DropDownMenus from "./DropDownMenus.js";
import SideBarList from "./SideBarList.js";
import CreateGroupChat from "./CreateGroupChat.js";

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
            <span>
            <ChatBox groupList={msgList} groupID={groupID}></ChatBox>
            </span>
        )}
        
        {isVisible == 1 && (
            <span>
            <CreateGroupChat></CreateGroupChat>
            </span>
        )}
    </>
    )
}