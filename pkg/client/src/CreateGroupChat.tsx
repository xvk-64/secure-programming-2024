import React, {useEffect, useState} from "react";
   
    // msgList.forEach((user) => {
    //     chatbox.push(
    //         <><p>[{user.timestamp}] <strong>{user.name}:  </strong>{user.message}</p></>
    //     );
    // });

    // const [groupChatName, setGroupChatName] = useState("");

    // const handleSubmit = (event: { preventDefault: () => void; }) => {
    //   event.preventDefault();
    //   alert(`The name you entered was: ${groupChatName}`)
    // }


export default function CreateGroupChat() {

    const [inputs, setInputs] = useState({});
    // store group members as group
    let groupList: React.ReactElement[] = []

    // event handler to grab values from fields
    const handleChange = (event: { target: { name: string; value: string; }; }) => {
      const name = event.target.name;
      const value = event.target.value;
      
      setInputs(values => ({...values, [name]: value}))
    }
  
        // nickanme : publickey
    // store the members
    const handleSubmit = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    //   alert(inputs.nickname+inputs.publicKey);
    //   groupList.push(inputs)
    //   console.log(groupList)
     
    }
    let groupCounter = 1;

    return (
        <>
        <div className="createChatDiv">
            <h4 className="heading">Create Groupchat</h4>
            <form onSubmit={handleSubmit}>
            <h4>Add users to Group</h4>
            {/* <label>Enter saved nickname, OR enter user's public key</label><br/><br/> */}

            <label>add nickname</label><br/>
            {/* get nickname*/}
            <input type="text" name="nickname" value={inputs.nickname || ""} onChange={handleChange}/>
       
            <label>User's public key</label><br/>
            {/* get public key*/}
            <input type="text" name="publicKey" value={inputs.publicKey || ""} onChange={handleChange}/><br/>

            {/* add user to working group*/}
            <button type="submit">Add user to group</button><br/>

            <h4>Group Members</h4><br/>
             {/* finalise group*/}
             </form>
            <button type="submit"> Create group! </button>


        </div>
        </>

    )
}