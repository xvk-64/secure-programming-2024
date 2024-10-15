import React, {useContext, useRef} from "react"
import {ClientContext} from "../../context/ClientContext.js";

export type FileUploadProps = {
    onUploadDone: (URL: string) => void;
}

export function FileUpload(props: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const clientContext = useContext(ClientContext);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = e => {
        e.preventDefault();

        fileInputRef.current?.click();
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async e => {
        e.preventDefault();

        const file = e.target.files?.item(0);
        if (!file)
            return;

        const formData = new FormData();
        formData.append('file', file);

        if (clientContext?.current?.serverAddress === undefined)
            return;

        const result = await fetch(clientContext?.current?.serverAddress + '/api/upload', {
            method: 'POST',
            body: formData,
        });

        const object = await result.json();

        console.log(object);

        if (! (typeof object.file_url === "string"))
            return;

        props.onUploadDone(object.file_url);
    }

    return (
        <>
            <button onClick={handleClick}>Upload file...</button>
            <input type="file" name="file" hidden={true} ref={fileInputRef} onChange={handleFileChange} />
        </>
    )
}
