const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 20 * 1024 * 1024 
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/",
            "application/pdf",
            "video/"
        ];
        console.log(file);
        // const allowed = allowedTypes.some(type =>
        //     type.endsWith("/")
        //         ? file.mimetype.startsWith(type)
        //         : file.mimetype === type
        // );
        
        // ⚠️⚠️ im bypassing the allowed types for development phase

        const allowed = true;


        console.log(allowed);
        if (allowed) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type"));
        }
    }
});

module.exports = {upload};
