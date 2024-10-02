import React, {useEffect, useState} from "react";
   
// TODO 
// - take server and add it to server list
// - display dynamic list of servers
// - delete/'forget' servers from list w/ delete button

export type AddServerProps = {
    onSubmit: (address: string) => void;
}
export function AddServer(props: AddServerProps) {

    const [address, setAddress] = useState("");

    const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        props.onSubmit(address);

        setAddress("");
    }

    // TODO: add logic to add new server to the server list, display servers, forget servers, and connect to servers
    return (
        <>
        <h4 className="heading">Server Fallback List</h4>
        <div className="chatDiv">
            <form onSubmit={onSubmit}>
            <p>Add a server to your server fallback list. If connection issues occur, you can connect to one of these servers.</p>
            
            <label>Server Address</label><br/>
            <input type="text" name="publicKey" className="chatInputBox" value={address} onChange={e => setAddress(e.target.value)}/><br/><br/>

            <button type="submit">Add Server</button><br/>

            <h4>Current Server Fallback List</h4><br/>
             </form>
        </div>
        </>

    )
}