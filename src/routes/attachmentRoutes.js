require("dotenv").config({
    path: __dirname + "./../.env"
});

const jwtKey = process.env.jwtKey;

const jsonwebtoken = require("jsonwebtoken");
const express = require("express");

const { verifyJwt } = require("./../middleware/verifyJWT");
const { roles, crRoles } = require("./../utils/roles.js");
const { upload } = require("./../services/attachmentService.js");

const cloudinary = require("cloudinary").v2;

const attachmentRouter = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


attachmentRouter.post(
    "/addAttachment",
    verifyJwt,
    upload.single("file"),
    async (req, res) => {

        const token = req.headers.authorization.replace("Bearer ", "");

        const data = jsonwebtoken.verify(token, jwtKey);

        if (
            !(
                (roles.includes(data.role) || crRoles.includes(data.role)) &&
                data.role !== "student"
            )
        ) {
            return res.status(403).json({
                msg: "nice try diddy"
            });
        }

        try {

            if (!req.file) {
                return res.status(400).json({
                    msg: "No file uploaded"
                });
            }

            const filename = req.file.originalname;
            const mime = req.file.mimetype;

            let fileType;

            if (mime.startsWith("image/")) {
                fileType = "Photos";
            }
            else if (mime.startsWith("video/")) {
                fileType = "Videos";
            }
            else if (mime === "application/pdf") {
                fileType = "PDFs";
            }
            // else {
                fileType = "Others";
            // }

            console.log("File type:", fileType);


            const result = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: `${fileType}`,
                        resource_type: "auto",
                        use_filename: true,
                        unique_filename: true
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }

                    }
                );

                stream.end(req.file.buffer);

            });


            console.log("Cloudinary upload successful:");
            console.log(result.secure_url);


            return res.status(200).json({

                filename: filename,

                url: result.secure_url,

                publicId: result.public_id,

                resourceType: result.resource_type

            });

        } catch (err) {

            console.error("Cloudinary upload failed:");
            console.error(err);

            return res.status(500).json({
                msg: "Failed to upload file"
            });

        }
    }
);


module.exports = {
    attachmentRouter
};