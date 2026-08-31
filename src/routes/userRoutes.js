require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwtKey;
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const {verifyJwt} = require("./../middleware/verifyJWT");
const userRouter = express.Router();
const {roles, crRoles} = require("./../utils/roles.js");
const {findUser, findUserAdmin, updateUser, updateUserFCM} = require("./../services/userService.js");
const {getUserNotifs} = require("./../services/notifService.js");
const { getUserForm } = require("../services/formService.js");
userRouter.get("/verifyJwt", verifyJwt, async(req, res) => {
    return res.status.json({msg:'success'});
});
// ✅
userRouter.get("/getUserDetails", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        // console.log("key ", jwtKey);
        // console.log(token);
        let data = jsonwebtoken.verify(token, jwtKey);
        // console.log("hi")
        const rollNumber = data.rollNumber;
        if(data.role == "student" && data.rollNumber == rollNumber) {
            let userData = await findUser({rollNumber:rollNumber});
            if(userData.length==1) {
                return res.status(200).json({data:userData, msg:"success"});
            }
            else {
                return res.status(404).json({msg:'no user found'});
            }
        }
        else if(roles.includes(data.role)) {
            let userData = await findUser({rollNumber:rollNumber});
            if(userData.length==1) {
                return res.status(200).json({data:userData, msg:"success"});
            }
            else {
                return res.status(404).json({msg:'no user found'});
            }
        }
        else {
            console.log(data);
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});

userRouter.post("/updateLinkedIn", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        let linkedin = req.body.linkedin; 
        if(roles.includes(data.role) && rollNumber == data.rollNumber && linkedin!="" && linkedin) {
            let result = await updateUser({rollNumber:rollNumber}, {linkedin:linkedin});
            if(result) {
                return res.status(200).json({msg:'success'});
            }
            else {
                return res.status(500).json({msg:'failed to update'});
                
            }
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

// ✅-partial
userRouter.get("/getEnrolledCourses", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const isActive = req.query.isActive;
        const year = req.query.year;
        const sem = req.query.sem;
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        if((roles.includes(data.role) || crRoles.includes(data.role)) && data.rollNumber == rollNumber) {
            let courses = (await findUserAdmin({rollNumber:rollNumber})).enrolledCourses;
            courses = year?courses.filter(c => c.year == year):courses;
            courses = sem?courses.filter(c => c.sem == sem):courses;
            courses = isActive?courses.filter(c => c.isActive == isActive):courses;
            return res.status(200).json({courses:courses, msg:"success"});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});


// NEED TO THINK ABOUT IT AGAIN
// userRouter.get("/getExams", verifyJwt, async(req, res) => {
//     try {
//         const token = req.headers.authorization.replace("Bearer ", "");
//         const rollNumber = data.rollNumber;
//         let data = jsonwebtoken.verify(token, jwtKey);
//         if(data.role == "student" && data.rollNumber == rollNumber) {
//             // granted
//         }
//         else {
//             return res.status(403).json({msg:'hehehehe boi'});
//         }
//     } catch(err) {
//         return res.status(500).json({msg:'error'});
//     }
// });






// This needs to be implemented in details after council meet
// userRouter.get("/getEvents", verifyJwt, async(req, res) => {
//     try {
//         const token = req.headers.authorization.replace("Bearer ", "");
//         let data = jsonwebtoken.verify(token, jwtKey);
//         const rollNumber = data.rollNumber;
//         if(data.role == "student" && data.rollNumber == rollNumber) {
//             // granted
//             // notifications utils here
//         }
//         else {
//             return res.status(403).json({msg:'hehehehe boi'});
//         }
//     } catch(err) {
//         return res.status(500).json({msg:'error'});
//     }
// });


userRouter.post("/updateFCM", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization;
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let fcmCode = req.body.fcmCode;
        if(crRoles.includes(data.role) || roles.includes(data.role)) {
            let result = await updateUserFCM(rollNumber, fcmCode);
            if(result) return res.status(200).json({msg:'success'});
            return res.status(404).json({msg:'failed to update'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});





module.exports = {userRouter};