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
    const handleChange = (event: { target: { value: string; }; }) => {
    //   const name = event.target.name;
      const value = event.target.value;
      // name: string;
      
      setInputs(values => ({...values, value}))
    } //  [name]:
  
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
        <h4 className="heading">Create Chat</h4>
        <div className="chatDiv">
            <form onSubmit={handleSubmit}>
            <p>Create a chat. Add multiple users to create a group chat.</p>
            
            {/* <label>Enter saved nickname, OR enter user's public key</label><br/><br/> */}
{/* 
            <label>add nickname</label><br/>
            {/* get nickname*/}
            {/* <input type="text" name="nickname" value={inputs.nickname || ""} onChange={handleChange}/><br/> */} 
       
            <label>User's fingerprint</label><br/>
            {/* get fingerprint*/}
            <input type="text" name="publicKey" className="chatInputBox" value={inputs.fingerprint || ""} onChange={handleChange}/><br/><br/>

            {/* add user to working group*/}
            <button type="submit">Add user to chat</button><br/>

            <h4>Current Chat Members:</h4><br/>
             {/* finalise group*/}
             </form>
            <button type="submit"> Finalise chat! </button>


        </div>
        </>

    )
}