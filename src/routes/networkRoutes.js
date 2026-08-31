require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwtKey;
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const {verifyJwt} = require("./../middleware/verifyJWT");
const networkRouter = express.Router();
const {roles} = require("./../utils/roles.js");
const {findNetwork, editNetwork, deleteNetwork, addNetwork, findNetworkV2} = require("./../services/networkService.js");
// const {getUserNotifs} = require("./../services/notifService.js");
// const { getUserForm } = require("../services/formService.js");

// ✅
networkRouter.get("/getNetworks", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let name = req.query.name;
        let domain = req.query.domain;
        let status = req.query.status;
        let company = req.query.company;
        let page = req.query.page?Number(req.query.page):1;
        let limit = req.query.limit?Number(req.query.limit):20;
        limit = limit>20?20:limit;
        name = name?name:"";
        domain = domain?domain:"";
        status = status?status:"";
        company = company?company:"";
        // console.log("params", name, domain, status, company);
        let networkData = await findNetwork(name, domain, status, company, page, limit);
        return res.status(200).json({data:networkData, msg:"success"});
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});
networkRouter.get("/getNetworksV2", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const nId = req.query.nId;
        // console.log("params", name, domain, status, company);
        let networkData = await findNetworkV2(nId);
        if(networkData.length==1) {
            return res.status(200).json({data:networkData[0], msg:"success"});
        } 
        else return res.status(404).json({msg:'no amulni/senior found'});
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});
// ✅
networkRouter.post("/editNetwork", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let nId = req.body.nId;
        let updatedData = req.body.updatedData;
        if(data.role != "student" && roles.includes(data.role)) {
            let result = await editNetwork(nId, updatedData);
            if(result) {
                return res.status(200).json({msg:"success"});
            }
            else {
                return res.status(500).json({msg:'failed to edit'});
            }
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});
// ✅
networkRouter.post("/addNetwork", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let rollNumber = data.rollNumber;
        let networkData = req.body.networkData;
        networkData.isVisible = true;
        console.log(networkData);
        networkData.createdById = rollNumber;
        if(data.role != "student" && roles.includes(data.role) && ((networkData.name&&networkData.name!=""))&&(networkData.status&&networkData.status!="")&&(networkData.domain&&networkData.domain!="")&&(networkData.linkedIn&&networkData.linkedIn!="")&&(networkData.experience&&networkData.experience!="")&&(networkData.role&&networkData.role!="")&&(networkData.year&&networkData.year!="")&&(networkData.company&&networkData.company!="")) {
            let result = await addNetwork(networkData, rollNumber);
            if(result) {
                return res.status(200).json({msg:"success"});
            }
            else {
                return res.status(500).json({msg:'failed to add network'});
            }
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

// ✅
networkRouter.post("/deleteNetwork", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let nId = req.body.nId;
        if(data.role != "student" && roles.includes(data.role)) {
            let result = await deleteNetwork(nId);
            if(result) {
                return res.status(200).json({msg:"success"});
            }
            else {
                return res.status(404).json({msg:'profile not found'});
            }
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});


module.exports = {networkRouter};