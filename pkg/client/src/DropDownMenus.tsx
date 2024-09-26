import React, {useEffect, useState} from "react";
import { Dropdown } from 'react-bootstrap';
// import Menu from 'react-bootstrap';
// import Item from 'react-bootstrap';
// import Header from 'react-bootstrap';
import ServerList from "./ServerList.js";
import CreateGroupChat from "./CreateGroupChat.js";

export default function DropDownMenus({setGroupID}){
    
  

      let groupDropdownList: React.ReactElement[] = []
      // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
      const groupList = [
          {groupID: 0, groupName: 'group1'},
          {groupID: 1, groupName: 'group2'},
          {groupID: 2, groupName: 'group4'},
      ];
      let counter = 1;
      groupList.forEach((group, index) => {
          groupDropdownList.push(
            //  href="#/action-1">
              <><Dropdown.Item eventKey={index} onClick={() => setGroupID(group.groupID)}>{group.groupName}</Dropdown.Item><br/><br/></>
          );
      });

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

    
