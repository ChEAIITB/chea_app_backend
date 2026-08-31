require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwtKey;
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const {verifyJwt} = require("./../middleware/verifyJWT");
const acadsRouter = express.Router();
const {roles, crRoles} = require("./../utils/roles.js");
const {slots} = require("./../utils/slots.js");
const { getRunningCourses, getCourseInfo, addRunningCourse, editRunningCourse, getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = require("../services/acadService.js");

acadsRouter.get("/getRunningCourses", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let sem = data.sem;
        let divison = data.division;
        let year = new Date().getFullYear();
        if(roles.includes(data.role)) {
            let courses = await getRunningCourses(rollNumber, year, sem, divison);
            return res.status(200).json({msg:'success', data:courses});
        }
        else return res.status(403).json({msg:'nice try diddy'});
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

acadsRouter.get("/getCourseInfo", verifyJwt, async(req, res) => {
    try {
        let token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let cId = req.query.cId;
        if(roles.includes(data.role)) {
            let courseInfo = await getCourseInfo(rollNumber, cId, (data.role != "student"));
            return res.status(200).json({data:courseInfo, msg:'success'});
        }
        else return res.status(403).json({msg:'nice try diddy'});
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});


acadsRouter.post("/addRunningCourse", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let division = data.division;
        let courseInfo = req.body.courseInfo;
        if(crRoles.includes(data.role) || data.role == "cr") {
            let result = await addRunningCourse(rollNumber, courseInfo, division);
            if(result) return res.status(200).json({msg:'success'});
            else return res.status(500).json({msg:'failed to add course'});
        }
        else {
            return res.status(403).json({msg:'nice try diddy'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'})
    }
});

acadsRouter.post("/editRunningCourse", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let division = data.division;
        let updatedData = req.body.data;
        let cId = req.body.cId;
        if(crRoles.includes(data.role) || data.role == "cr") {
            let result = await editRunningCourse(rollNumber, cId, division, updatedData);
            if(result) return res.status(200).json({msg:'success'});
            else return res.status(500).json({msg:'failed to edit course'});
        }
        else {
            return res.status(403).json({msg:'nice try diddy'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'})
    }
});


acadsRouter.get("/getAnnouncements", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let cId = req.query.cId;
        let rollNumber = data.rollNumber;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 20, 1),
            20
        );
        if(roles.includes(data.role) || crRoles.includes(data.role)) {
            let announcements = await getAnnouncements(cId, page, limit, rollNumber);
            return res.status(200).json({data:announcements, msg:'success'});

        }
        else {
            return res.status(403).json({msg:'nice try diddy'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'})
    }
});

acadsRouter.post("/addAnnouncement", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let courseCode = req.body.courseCode;
        let announcementData = req.body.data;
        let cId = req.body.cId;
        if(crRoles.includes(data.role) || data.role == "cr") {
            let result = await addAnnouncement(cId, announcementData, rollNumber, courseCode);
            if(result) return res.status(200).json({msg:'success', announcementId:result});
            else return res.status(500).json({msg:'failed to edit course'});
        }
        else {
            return res.status(403).json({msg:'nice try diddy'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'})
    }
});


acadsRouter.post("/editAnnouncement", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let updatedData = req.body.data;
        let announcementId = req.body.announcementId;
        if(crRoles.includes(data.role) || data.role == "cr") {
            let result = await updateAnnouncement(announcementId, updatedData, rollNumber);
            if(result) return res.status(200).json({msg:'success', announcementId:result});
            else return res.status(500).json({msg:'failed to edit announcement'});
        }
        else {
            return res.status(403).json({msg:'nice try diddy'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'})
    }
});




acadsRouter.post("/deleteAnnouncement", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let announcementId = req.body.announcementId;
        if(crRoles.includes(data.role) || data.role == "cr") {
            let result = await deleteAnnouncement(announcementId, rollNumber);
            if(result) return res.status(200).json({msg:'success', announcementId:result});
            else return res.status(500).json({msg:'failed to delete announcement'});
        }
        else {
            return res.status(403).json({msg:'nice try diddy'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'})
    }
});


acadsRouter.get("/addTimetableCourse", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let courseCode = req.query.courseCode;
        if(roles.includes(data.role)) {
            // let result = await deleteAnnouncement(announcementId, rollNumber);
            if(result) return res.status(200).json({msg:'success', announcementId:result});
            else return res.status(500).json({msg:'failed to delete announcement'});
        }
        else {
            return res.status(403).json({msg:'nice try diddy'});
        }
    } catch(err) {
        return res.status(500).json({msg:'err'});
    }
});