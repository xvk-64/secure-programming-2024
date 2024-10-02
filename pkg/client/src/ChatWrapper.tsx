import React, {useEffect, useState} from "react";

import GroupUserList from "./GroupUserList.js";
import SideBarList from "./SideBarList.js";
import MiddleDivContent from "./MiddleDivContent.js";

    //TODO add group id link to groupuserlist to display users correctly


export default function ChatWrapper() {
    const [groupID, setGroupID] = useState(0)
    const [isVisible, setIsVisible] = useState(0)

    return <>
        <div className="main">
            <div className="leftDiv">
                <SideBarList setGroupID={setGroupID} setIsVisible={setIsVisible}></SideBarList>
            </div>
            <div className="middleDiv">
                <MiddleDivContent groupID={groupID} isVisible={isVisible}></MiddleDivContent>
            </div>
            <GroupUserList isVisible={isVisible}></GroupUserList>
        </div>
    </>
}

