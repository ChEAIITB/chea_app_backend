require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwtKey;
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const shareRouter = express.Router();
const {roles} = require("./../utils/roles.js");
// const {findUser, findUserAdmin, updateUser} = require("./../services/userService.js");
const {getUserEvents, getUserEventsV2, deleteEvent, updateQrScanned, addEvent, markAttendance} = require("./../services/eventService.js");


shareRouter.get("/event", async(req, res) => {
    try {
        
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

