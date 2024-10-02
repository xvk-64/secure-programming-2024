import React, {useContext, useState} from "react";
import { UserContext } from "./UserContext";

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

    const {friends, updateFriend} = useContext(UserContext) || {} as UserContext;
    
    // store friends
    const addFriend = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateFriend(fingerprint, nickname);
    }

    let friendsList: React.ReactElement[] = Array.from(friends).reduce<React.ReactElement[]>((acc, current, index) => {
        return [...acc, <p key={index}>{current[0]}: {current[1]}</p>]
    }, []);

    return <>
        <h4 className="heading">Add Friend</h4>
        <div className="chatDiv">
            <p>Register a friend by giving their fingerprint a nickname.</p>
            <p> All instances where this friend is present will show their nickname rather than fingerprint</p>
            <br/>
            <form onSubmit={addFriend}>
                <label>Nickname</label>
                <br/><br/>
                <input type="text" name="nickname" value={nickname || ""} onChange={onNicknameChange}/>
                <br/><br/>
                <label>User's fingerprint</label><br/>
                <input type="text" name="fingerprint" className="chatInputBox" value={fingerprint || ""} onChange={onFingerprintChange}/>
                <br/><br/>
                <button type="submit">Register friend</button><br/>
             </form>
             <h4>Registered Friend List:</h4>
             <br/>
             {friendsList}
        </div>
    </>
}