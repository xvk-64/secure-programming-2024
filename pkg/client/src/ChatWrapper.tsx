import React, {useEffect, useState} from "react";

import ChatBox from "./ChatBox.js"
import GroupUserList from "./GroupUserList.js";
import ServerList from "./ServerList.js";
import ChatInput from "./ChatInput.js";
import GroupChatList from "./GroupChatList.js";
import DropDownMenus from "./DropDownMenus.js";
import SideBarList from "./SideBarList.js";



export default function ChatWrapper() {

    const msgList = [
        [{timestamp: '00:00',  name: 'fred', message: 'wowowowowowowowoww'},
        {timestamp: '00:05', name: 'coolbeanie', message: 'hey guys can you help im stuck in the void'},
        {timestamp: '00:10', name: '2cool4shoes', message: 'skill issue'}],
        [{timestamp: '00:10',  name: 'coolbeanie', message: ':('},
        {timestamp: '00:11',  name: 'fred', message: 'uwu'}]
    ];
   
    const [groupID, setGroupID] = useState(0)

    return <>
            <div  className="main">
                <div  className="leftDiv" overflow-y: scroll>
                    <SideBarList setGroupID={setGroupID}></SideBarList>
                    </div>
                <div className="middleDiv">
                    <ChatBox groupList={msgList} groupID={groupID}></ChatBox>
                    <ChatInput></ChatInput>
                </div>
                
                <div className="rightDiv">
                    <GroupUserList></GroupUserList>
                </div>
            </div>
        </>
}

