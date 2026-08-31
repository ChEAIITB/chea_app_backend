require("dotenv").config({
    path:__dirname+"./../.env"
});
const bcrypt = require("bcrypt");
const express = require("express");
const jwtKey = process.env.jwtKey;
const jsonwebtoken = require("jsonwebtoken");
const axios = require("axios");
const { findUser } = require("../services/userService");
const authRouter = express.Router();
// const {saveUser, findUser, updateUser} = require("./../services/dbFuncs.js");


authRouter.get("/testPoint", async(req, res) => {
    let id = Number(req.query.id);
    let user = (await findUser({}))[id];
    console.log(user);
    let jwt = jsonwebtoken.sign({name:user.name, rollNumber:user.rollNumber, division:user.division, batch:user.batch, role:user.role}, jwtKey);
    let lastNo = Number(user['rollNumber'].split("")[6])%2==0?"s2":"s1";
    let data = {
        name:user.name,
        batch:user.batch,
        division:lastNo,
        rollNumber : user.rollNumber,
        token:jwt,
        role:user.role
    };
    res.status(200).json({data:data});
});


module.exports = {authRouter};