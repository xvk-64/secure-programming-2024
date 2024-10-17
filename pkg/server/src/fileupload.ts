import {randomUUID} from "node:crypto";
import fileUpload from "express-fileupload";
import {RequestHandler} from "express";

export const handleFileUpload: RequestHandler = (request, response) => {
    try {
        if (!request.files) {
            console.log("file didnt upload")
            response.status(400).send("Bad Request: File Upload Unsuccessful")

        } else {
            //send response

            let newFileName = randomUUID() // set random name
            let file = request.files.file as fileUpload.UploadedFile
            let tempName = file.name;
            let parts = tempName.split('.');
            const file_extension = parts.length > 1 ? parts[parts.length - 1] : "";

            let filename = newFileName + '.' + file_extension;
            file.mv('./filestore/' + filename, (err) => {
                if (err) {
                    response.status(500).send("Internal Server Error: File Could Not Be Saved");
                } else {
                    const fileURL = request.protocol + "://" + request.get("host") + "/filestore/" + filename;

                    response.send({file_url: fileURL});
                }
            })
        }
    } catch (err) {
        response.status(500).send("Internal Server Error: File Upload Unsuccessful");
    }
};