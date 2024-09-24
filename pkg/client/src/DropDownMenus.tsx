import React, {useEffect, useState} from "react";
import { Dropdown } from 'react-bootstrap';
// import Menu from 'react-bootstrap';
// import Item from 'react-bootstrap';
// import Header from 'react-bootstrap';
import ServerList from "./ServerList.js";
import CreateGroupChat from "./CreateGroupChat.js";

export default function DropDownMenus(){
    
    const menuItemsData = [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'Services',
          url: '/services',
        },
        {
          title: 'About',
          url: '/about',
        },
      ];

      let groupDropdownList: React.ReactElement[] = []
      // let messageList = ["wowowowoww", "cool message bro", "i like soup"];
      const groupList = [
          {groupName: 'group1'},
          {groupName: 'group2'},
          {groupName: 'group4'},
      ];
      let counter = 1;
      groupList.forEach((group) => {
        counter += 1;
          groupDropdownList.push(
            //  href="#/action-1">
              <><Dropdown.Item eventKey={counter}>{group.groupName}</Dropdown.Item><br/><br/></>
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

    
