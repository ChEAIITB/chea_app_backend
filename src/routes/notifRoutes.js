require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwtKey;
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const {verifyJwt} = require("./../middleware/verifyJWT");
const notifRouter = express.Router();
const {roles} = require("./../utils/roles.js");
const {findUser, findUserAdmin, updateUser} = require("./../services/userService.js");
const {getUserNotifs} = require("./../services/notifService.js");
const { getUserForm } = require("../services/formService.js");


notifRouter.get("/getNotifs", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        if(roles.includes(data.role)) {
            let notifs = await getUserNotifs(data.id, page, limit, rollNumber);
            return res.status(200).json({notifs:notifs, msg:'success'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

module.exports = {notifRouter};

// notifRouter.post("/addNotifs", async(req, res) => {
//     try {
//         const token = req.headers.authorization.replace("Bearer ", "");
//         const rollNumber = req.query.rollNumber;
//         let data = jsonwebtoken.verify(token, jwtKey);
//         let title = req.body.title;
//         let text = req.body.text;
//         let targetUsers = req.body.targetUsers;
//         let 
//         if(data.role != "student" && roles.includes(data.role)) {
//             let notifs = await getUserNotifs(data.id, page, limit, rollNumber);
//             return res.status(200).json({notifs:notifs, msg:'success'});
//         }
//         else {
//             return res.status(403).json({msg:'hehehehe boi'});
//         }
//     } catch(err) {
//         return res.status(500).json({msg:'error'});
//     }
// });