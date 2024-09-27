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


export default function AddServer() {

    const [inputs, setInputs] = useState({});
    // store group members as group
    let serverList: React.ReactElement[] = []

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

    // TODO: add logic to add new server to the server list, display servers, forget servers, and connect to servers
    return (
        <>
        <h4 className="heading">Server List</h4>
        <div className="chatDiv">
            <form onSubmit={handleSubmit}>
            <p>Add a server to your available server list.</p>
            
            <label>Server Address</label><br/>
            <input type="text" name="publicKey" className="chatInputBox" value={inputs.serverAddress || ""} onChange={handleChange}/><br/><br/>

            <button type="submit">Add Server</button><br/>

            <h4>Current Server List</h4><br/>
             {/* finalise group*/}
             </form>
          


        </div>
        </>

    )
}