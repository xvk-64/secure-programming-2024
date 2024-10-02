import React, {useEffect, useState} from "react";


export function GroupChatList() {
    let grouplist: React.ReactElement[] = []
    // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
    const groupList = [
        {groupName: 'group1'},
        {groupName: 'group2'},
        {groupName: 'group4'},
    ];
   
    groupList.forEach((group) => {
        grouplist.push(
            <><p>{group.groupName}</p></>
        );
    });

    return (
        <>
            {grouplist}
        </>

    )
}