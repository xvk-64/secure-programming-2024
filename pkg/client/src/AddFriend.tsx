import React, {useEffect, useState} from "react";

// TODO
// - dynamically update list of friends
// - decide on format for storing friends
// - show list of friends, including nickname/public key pair
// - delete friends, pop from list

export function AddFriend() {

    const [nickname, setNickname] = useState("");
    const [fingerprint, setFingerprint] = useState("");

    // store group members as group
    let groupList: React.ReactElement[] = []

    const onNicknameChange:  React.ChangeEventHandler<HTMLInputElement> = e => {
        setNickname(e.target.value);
    }
    const onFingerprintChange:  React.ChangeEventHandler<HTMLInputElement> = e => {
        setFingerprint(e.target.value);
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

  
            <input type="text" name="nickname" value={nickname || ""} onChange={onNicknameChange}/><br/><br/>
       
            <label>User's fingerprint</label><br/>
            {/* get fingerprint*/}
            <input type="text" name="publicKey" className="chatInputBox" value={fingerprint || ""} onChange={onFingerprintChange}/><br/><br/>

            <button type="submit">Register friend</button><br/>

            <h4>Registered Friend List:</h4><br/>
             </form>
 


        </div>
        </>

    )
}