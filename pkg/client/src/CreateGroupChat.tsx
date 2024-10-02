import React, {useEffect, useState} from "react";


export default function CreateGroupChat() {
    const [groupMembers, setGroupInputs] = useState<string[]>([]);

    // event handler to grab values from fields
    const addMember = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newGroupMember = event.target[0].value;
        setGroupInputs(values => [...values, newGroupMember])
    }
  
    // store the members
    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        console.log(groupMembers);
    }

    const groupMemberElements = groupMembers.reduce<React.ReactElement[]>((acc, current, index) => [...acc, <p key={index}>{current}</p>], []);

    return <>
        <h4 className="heading">Create Chat</h4>
        <div className="chatDiv">
            <p>Create a chat. Add multiple users to create a group chat.</p>
            <form onSubmit={addMember}>
                <label>User's fingerprint</label>
                <br/>
                <input type="text" name="fingerprint" className="chatInputBox"/>
                <br/><br/>
                <button type="submit">Add user to chat</button>
            </form>
            <br/>
            <form onSubmit={handleSubmit}>
                <h4>Prospective Chat Members:</h4>
                {groupMemberElements}
                <br/>
                {/* finalise group*/}
                <button type="submit"> Finalise chat! </button>
            </form>
        </div>
    </>
}