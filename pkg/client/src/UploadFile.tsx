import React, { ReactElement, useContext, useState } from 'react'

// on submit, get link? address? of file, submit it as a chat message


export default function UploadFile(){
  
    const [file, setFile] = useState<File | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
      if (file) {
        console.log('Uploading file...');
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const result = await fetch('http://localhost:3307/api/upload', {
            method: 'POST',
            body: formData,
          });
  
          const object = await result.json();
  
          console.log("this made it to the other side:");
          console.log(object);
          let link = 'http://localhost:3307/filestore/' + object.filename;
          //// FULL LINK TO SEND TO USER
          console.log(link)

        } catch (error) {
          console.error(error);
        }
      }
    };
  
    return (
      <>
        <div className="input-group">
          <input id="file" type="file" onChange={handleFileChange} />
        </div>
        {file && (
          <section>
            File details:
            <ul>
              <li>Name: {file.name}</li>
              <li>Type: {file.type}</li>
              <li>Size: {file.size} bytes</li>
            </ul>
          </section>
        )}
  
        {file && (
          <button
            onClick={handleUpload}
            className="submit"
          >Upload a file</button>
        )}
      </>
    );
}