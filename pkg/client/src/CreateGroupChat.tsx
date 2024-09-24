import React, {useEffect, useState} from "react";


export default function CreateGroupChat() {

   
    // msgList.forEach((user) => {
    //     chatbox.push(
    //         <><p>[{user.timestamp}] <strong>{user.name}:  </strong>{user.message}</p></>
    //     );
    // });

    return (
        <>
        <h4 className="heading">Chat Name</h4>
        <div className="createChatDiv">
            <h4 className="heading">Create Groupchat</h4>
            <h4> Groupchat name</h4>
            <label>Visible only to you!</label><br/>
            <input type="text"/><br/>
            <h4>Add users to Group</h4>
            <label>Enter saved nickname, OR enter user's public key</label><br/><br/>
            <label>Search contact list for nickname</label><br/>
            <input type="text"/>
            <p>   OR   </p>
            <label>User's public key</label><br/>
            <input type="text"/><br/>
            <button type="submit">Add user to group</button><br/>

            <h4>Group Members</h4><br/>
            <button type="submit"> Create group! </button>


        </div>
        </>

    )
}