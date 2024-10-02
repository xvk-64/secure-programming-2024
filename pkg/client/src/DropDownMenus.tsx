import React, {useContext, useEffect, useState} from "react";
import { Dropdown } from 'react-bootstrap';
import {ServerList} from "./ServerList.js";
import {CreateGroupChat} from "./CreateGroupChat.js";
import { UserContext } from "./UserContext.js";

export type DropDownMenusProps = {
    setGroupID: (groupID: number) => void;
}
export function DropDownMenus(props: DropDownMenusProps){
    const {groups} = useContext(UserContext) || {} as UserContext;
    let groupDropdownList: React.ReactElement[] = [];
    for(let i = 0; i < groups.length; i++) {
        groupDropdownList.push(
            <><Dropdown.Item eventKey={i} onClick={() => props.setGroupID(i)}>group {i}</Dropdown.Item><br/><br/></>
        );
    }

      const [toggle1, setToggle1] = useState(false);
      const [toggle2, setToggle2] = useState(false);

      const [showCreateGroup, setCreateGroup] = useState(false);
      

// pull groups from list?
      return(
        <>
            <div  overflow-y: scroll>
            <button onClick={() => setToggle1(!toggle1)}>Group Chats</button><button onClick={() => setCreateGroup(!showCreateGroup)}>+</button><br/>
            {toggle1 && (
                <Dropdown>
                    <span>
                    {groupDropdownList}
                    </span>
                </Dropdown>)}

            {showCreateGroup && <CreateGroupChat></CreateGroupChat>

            }

            <button onClick={() => setToggle2(!toggle2)}>Servers</button><button>+</button>
            {toggle2 && (
                <Dropdown>
                    <span>
                        <ServerList></ServerList>
                    </span>
                </Dropdown>)}
            

            </div>
        </>

     

        )
      

    }

    
