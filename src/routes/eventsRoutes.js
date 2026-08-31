require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwtKey;
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const {verifyJwt} = require("./../middleware/verifyJWT");
const eventsRouter = express.Router();
const {roles} = require("./../utils/roles.js");
// const {findUser, findUserAdmin, updateUser} = require("./../services/userService.js");
const {getUserEvents, getUserEventsV2, deleteEvent, editEvent, updateQrScanned, addEvent, markAttendance} = require("./../services/eventService.js");



/**
 * getEventsV1 -> title, photoAttachments, bodyText, createdAt, eventUrl
 * getEventsV2 -> all Info About Event
 */

eventsRouter.get("/getEventsV1", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const query = req.query.query.trim();
        const page = req.query.page;
        const limit = req.query.limit
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        if(roles.includes(data.role) && data.rollNumber == rollNumber) {
            console.log(query, page, limit, rollNumber);
            let eventsData = await getUserEvents(query, page, limit, rollNumber);
            console.log(eventsData);
            return res.status(200).json({msg:'success', data:eventsData});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});


eventsRouter.get("/getEventsV2", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const eventId = req.query.eventId;
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        if(roles.includes(data.role) && data.rollNumber == rollNumber) {
            let eventsData = await getUserEventsV2(eventId, rollNumber);
            console.log(eventsData);
            return res.status(200).json({msg:'success', data:eventsData});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});


eventsRouter.post("/deleteEvent", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const eventId = req.body.eventId;
        let data = jsonwebtoken.verify(token, jwtKey);
        if(data.role != "student" && roles.includes(data.role)) {
            let result = await deleteEvent(eventId);
            if(result) return res.status(200).json({msg:'success'});
            else return res.status(400).json({msg:'failed to delete'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

eventsRouter.post("/editEvent", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const eventId = req.body.eventId;
        const eventData = req.body.eventData;
        let data = jsonwebtoken.verify(token, jwtKey);
        if(data.role != "student" && roles.includes(data.role)) {
            let result = await editEvent(eventId, eventData);
            if(result) return res.status(200).json({msg:'success'});
            else return res.status(400).json({msg:'failed to edit'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});

eventsRouter.post("/verifyQR", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const eventId = req.body.eventId;
        const userCode = req.body.userCode;
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        if(data.role != "student" && roles.includes(data.role)) {
            let result = await updateQrScanned(eventId, rollNumber, userCode);
            if(result) return res.status(200).json({msg:'success'});
            else return res.status(400).json({msg:'failed to edit'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

eventsRouter.post("/addEvent", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const eventData = req.body.eventData;
        console.log(eventData);
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        if(data.role != "student" && roles.includes(data.role)) {
            let result = await addEvent(rollNumber, eventData);
            if(result) return res.status(200).json({msg:'success'});
            else {console.log("hi");return res.status(400).json({msg:'failed to edit'});}
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});


eventsRouter.post("/markAttendance", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const eventId = req.body.eventId;
        const attendanceCode = req.body.attendanceCode;
        let data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        if(roles.includes(data.role)) {
            let result = await markAttendance(rollNumber, eventId, attendanceCode);
            if(result) return res.status(200).json({msg:'success'});
            else return res.status(400).json({msg:'failed to edit'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

module.exports = {eventsRouter};