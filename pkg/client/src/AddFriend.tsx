import React, {useEffect, useState} from "react";

// TODO
// - dynamically update list of friends
// - decide on format for storing friends
// - show list of friends, including nickname/public key pair
// - delete friends, pop from list

export default function AddFriend() {

    const [inputs, setInputs] = useState({});
    // store group members as group
    let groupList: React.ReactElement[] = []

    // event handler to grab values from fields
    const handleChange = (event: { target: { name: string; value: string; }; }) => {
      const name = event.target.name;
      const value = event.target.value;
   
      
      setInputs(values => ({...values, [name]: value}))
    } 
  
    // store friends
    const handleSubmit = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    //   alert(inputs.nickname+inputs.publicKey);
    //   groupList.push(inputs)
    //   console.log(groupList)
     
    }
    let groupCounter = 1;

    return (
        <>
        <h4 className="heading">Add Friend</h4>
        <div className="chatDiv">
            <form onSubmit={handleSubmit}>
            <p>Register a friend by giving their fingerprint a nickname.</p>
            <p> All instances where this friend is present will show their nickname rather than fingerprint</p><br/>
            
            <label>Nickname</label><br/><br/>

  
            <input type="text" name="nickname" value={inputs.nickname || ""} onChange={handleChange}/><br/><br/>
       
            <label>User's fingerprint</label><br/>
            {/* get fingerprint*/}
            <input type="text" name="publicKey" className="chatInputBox" value={inputs.fingerprint || ""} onChange={handleChange}/><br/><br/>

            <button type="submit">Register friend</button><br/>

            <h4>Registered Friend List:</h4><br/>
             </form>
 


        </div>
        </>

    )
}