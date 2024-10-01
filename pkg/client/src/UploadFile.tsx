import React, { ReactElement, useContext, useState } from 'react'

const [file, setFile] = useState<File | null>(null);
return <>
    <input type="file" onChange={(event) => {setFile(event.target.files ? event.target.files[0] : null);}}></input>
    <button onClick={() => {upload(file);}}>upload</button>
</>


export default function UploadFile(){
    
    const input = document.getElementById('fileUpload');
    const upload = (file) => {
        fetch('http://localhost:3307/api/upload', { 
            method: 'POST',
            body: file})
        }

    const onSelectFile = () => upload(input.files[0]);
    input.addEventListener('change', onSelectFile, false);

    return
        <>
            <form method='POST'>
            <div>
                <label>Select file to upload</label>
                <input type="file" id="fileUpload">
            </div>
            <button type="submit">Submit</button>
            </form>
        </>

};