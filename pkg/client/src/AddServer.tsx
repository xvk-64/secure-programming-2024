import React, {useEffect, useState} from "react";
   
// TODO 
// - take server and add it to server list
// - display dynamic list of servers
// - delete/'forget' servers from list w/ delete button

export default function AddServer() {

    const [inputs, setInputs] = useState({});
    let serverList: React.ReactElement[] = []

    // event handler to grab values from fields
    const handleChange = (event: { target: { value: string; }; }) => {
      const value = event.target.value;
      
      setInputs(values => ({...values, value}))
    } 
  

    const handleSubmit = (event: { preventDefault: () => void; }) => {
      event.preventDefault();
    
    }
    let groupCounter = 1;

    // TODO: add logic to add new server to the server list, display servers, forget servers, and connect to servers
    return (
        <>
        <h4 className="heading">Server Fallback List</h4>
        <div className="chatDiv">
            <form onSubmit={handleSubmit}>
            <p>Add a server to your server fallback list. If connection issues occur, you can connect to one of these servers.</p>
            
            <label>Server Address</label><br/>
            <input type="text" name="publicKey" className="chatInputBox" value={inputs.serverAddress || ""} onChange={handleChange}/><br/><br/>

            <button type="submit">Add Server</button><br/>

            <h4>Current Server Fallback List</h4><br/>
             </form>
        </div>
        </>

    )
}