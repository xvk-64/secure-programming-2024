import React, {useEffect, useState} from "react";
import {Chatbox} from "./Chatbox.js";
import {CreateGroupChat} from "./CreateGroupChat.js";
import {AddFriend} from "./AddFriend.js";
import {AddServer} from "./AddServer.js";
import {PublicBroadcast} from "./PublicBroadcast.js";
import {PatBaba} from "./PatBaba.js";



// TODO
// - friend list/ add friend button/screen

const msgList = [
    [{timestamp: '00:00',  name: 'fred', message: 'wowowowowowowowoww'},
    {timestamp: '00:05', name: 'coolbeanie', message: 'hey guys can you help im stuck in the void'},
    {timestamp: '00:10', name: '2cool4shoes', message: 'skill issue'}],
    [{timestamp: '00:10',  name: 'coolbeanie', message: ':('},
    {timestamp: '00:11',  name: 'fred', message: 'uwu'}]
];

export type MiddleDivContentProps  = {
    groupID: string;
    isVisible: number;
}
export function MiddleDivContent(props: MiddleDivContentProps) {

    const onAddServer = (address: string) => {}

    let visibleElement;
    switch(props.isVisible) {
        case 0:
            visibleElement = <Chatbox groupID={props.groupID}></Chatbox>;
            break;
        case 1:
            visibleElement = <CreateGroupChat></CreateGroupChat>;
            break;
        case 2:
            visibleElement = <AddFriend></AddFriend>;
            break;
        case 3:
            visibleElement = <AddServer onSubmit={onAddServer}></AddServer>;
            break;
        case 4:
            visibleElement = <PublicBroadcast></PublicBroadcast>;
            break;
      
    }

    return <>{visibleElement}</>
}