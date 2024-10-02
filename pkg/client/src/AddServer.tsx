import React, {useContext, useEffect, useState, type FormEvent} from "react";
import { UserContext } from "./UserContext.js";
   
// TODO 
// - take server and add it to server list
// - display dynamic list of servers
// - delete/'forget' servers from list w/ delete button

export default function AddServer() {
    const {servers, addServer} = useContext(UserContext) || {} as UserContext;
    const [serverURL, setServerURL] = useState<string>("http://localhost:3307");

    const onAddServer = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addServer(serverURL);
        setServerURL("");
    }

    let serverList: React.ReactElement[] = servers.reduce<React.ReactElement[]>((acc, current, index) => [...acc, <p key={index}>{current}</p>], []);

    return <>
        <h4 className="heading">Server Fallback List</h4>
        <div className="chatDiv">
            <form onSubmit={onAddServer}>
                <p>Add a server to your server fallback list. If connection issues occur, you can connect to one of these servers.</p>
                
                <label>Server Address</label><br/>
                <input type="text" name="server" className="chatInputBox" value={serverURL} onChange={e => setServerURL(e.target.value)}/><br/><br/>

                <button type="submit">Add Server</button><br/>
            </form>
            <h4>Current Server Fallback List:</h4>
            <br/>
            {serverList}
        </div>
    </>
}