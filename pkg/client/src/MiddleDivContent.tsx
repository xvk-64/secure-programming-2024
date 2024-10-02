import React, {useEffect, useState} from "react";

import ChatBox from "./ChatBox.js";
import CreateGroupChat from "./CreateGroupChat.js";
import AddServer from "./AddServer.js";
import PatBaba from "./PatBaba.js";
import AddFriend from "./AddFriend.js";
import PublicBroadcast from "./PublicBroadcast.js";


// TODO
// - friend list/ add friend button/screen

const msgList = [
    [{timestamp: '00:00',  name: 'fred', message: 'wowowowowowowowoww'},
    {timestamp: '00:05', name: 'coolbeanie', message: 'hey guys can you help im stuck in the void'},
    {timestamp: '00:10', name: '2cool4shoes', message: 'skill issue'}],
    [{timestamp: '00:10',  name: 'coolbeanie', message: ':('},
    {timestamp: '00:11',  name: 'fred', message: 'uwu'}]
];


export default function MiddleDivContent({groupID, isVisible}) {
    let visibleElement;
    switch(isVisible) {
        case 0:
            visibleElement = <ChatBox groupList={msgList} groupID={groupID}></ChatBox>;
            break;
        case 1:
            visibleElement = <CreateGroupChat></CreateGroupChat>;
            break;
        case 2:
            visibleElement = <AddFriend></AddFriend>;
            break;
        case 3:
            visibleElement = <AddServer></AddServer>;
            break;
        case 4:
            visibleElement = <PublicBroadcast></PublicBroadcast>;
            break;
        default:
            visibleElement = <PatBaba></PatBaba>;
            break;
    }

    return <>{visibleElement}</>
}