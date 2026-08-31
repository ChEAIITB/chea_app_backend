require("dotenv").config({
    path:__dirname+"./../.env"
});
const jwtKey = process.env.jwtKey;
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const {verifyJwt} = require("./../middleware/verifyJWT");
const formRouter = express.Router();
const {roles, crRoles} = require("./../utils/roles.js");
const {getUserNotifs} = require("./../services/notifService.js");
const { getUserForm, getUserFormV2, createForm, submitForm, getFormReponse, isSync, syncResponses, getUserResponse, editForm } = require("../services/formService.js");


formRouter.get("/getFormsV1", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const startDate = Number(req.query.start);
        const endDate = Number(req.query.end);
        const query = req.query.query;
        let isSubmitted = req.query.isSubmitted;
        const data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        isSubmitted = Number(isSubmitted); // 0 - all, 1 - submitted, 2 - unsubmitted
        if(roles.includes(data.role) && data.rollNumber == rollNumber) {
            let forms = await getUserForm(rollNumber, startDate, endDate, isSubmitted, query);
            return res.status(200).json({forms:forms, msg:'success'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});

formRouter.get("/getFormsV2", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const data = jsonwebtoken.verify(token, jwtKey);
        const formId = req.query.formId;
        const rollNumber = data.rollNumber;
        if(roles.includes(data.role)) {
            let forms = await getUserFormV2(rollNumber, formId);
            return res.status(200).json({forms:forms, msg:'success'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

formRouter.post("/createForm", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const data = jsonwebtoken.verify(token, jwtKey);
        const formData = req.body.formData;
        let notif = req.body.notif;
        let emailAccess = req.body.emailAccess;
        const rollNumber = data.rollNumber;
        if(roles.includes(data.role) && data.role !="student") {
            let form = await createForm(rollNumber, formData, emailAccess, notif);
            if(form)
                return res.status(200).json({msg:'success'});
            return res.status(500).json({msg:'failed to create form'});;
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({msg:'error'});
    }
});

formRouter.post("/submitForm", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const data = jsonwebtoken.verify(token, jwtKey);
        const formData = req.body.formData; // this an array containing answers objects
        const rollNumber = data.rollNumber;
        const formId = req.body.formId;
        if(roles.includes(data.role)) {
            let form = await submitForm(formData, rollNumber, formId);
            if(form)
                return res.status(200).json({msg:'success'});
            return res.status(500).json({msg:'failed to create form'});;
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

formRouter.get("/getResponses", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const formId = req.query.formId;
        let data = jsonwebtoken.verify(token, jwtKey);
        if(data.role != "student" && roles.includes(data.role)) {
            let responses = await getFormReponse(formId, page, limit);
            return res.status(200).json({data:responses, msg:'success', page : page, limit:limit});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

formRouter.get("/isSync", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const formId = req.query.formId;
        let data = jsonwebtoken.verify(token, jwtKey);
        if(data.role != "student" && roles.includes(data.role)) {
            let response = await isSync(formId);
            return res.status(200).json({data:response, msg:'success'});
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

formRouter.post("/syncEntries", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const data = jsonwebtoken.verify(token, jwtKey);
        const spreadsheetId = req.body.spreadsheetId;
        const formId = req.body.formId; // this an array containing answers objects
        if(roles.includes(data.role) && data.role != "student") {
            let result = await syncResponses(formId, spreadsheetId);
            if(result)
                return res.status(200).json({msg:'success'});
            return res.status(500).json({msg:'failed to sync repsonses'});;
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

formRouter.get("/getUserResponse", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const data = jsonwebtoken.verify(token, jwtKey);
        const rollNumber = data.rollNumber;
        const formId = req.body.formId; // this an array containing answers objects
        if((roles.includes(data.role) || crRoles.includes(data.role)) && data.role != "student") {
            let result = await getUserResponse(formId, rollNumber);
            if(result)
                return res.status(200).json({msg:'success'});
            return res.status(500).json({msg:'failed to sync repsonses'});;
        }
        else {
            return res.status(403).json({msg:'hehehehe boi'});
        }
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});

// formRouter.post("/deleteForm", verifyJwt, async(req, req) => {
//     try {
//         const token = req.headers.authorization.replace("Bearer ", "");
//         const data = jsonwebtoken.verify(token, jwtKey);
//         const formId = req.body.formId; // this an array containing answers objects
//         if(roles.includes(data.role) && data.role != "student") {
//             let result = await syncResponses(formId, spreadsheetId);
//             if(result)
//                 return res.status(200).json({msg:'success'});
//             return res.status(500).json({msg:'failed to sync repsonses'});;
//         }
//         else {
//             return res.status(403).json({msg:'hehehehe boi'});
//         }
//     } catch(err) {
//         return res.status(500).json({msg:'error'});
//     }
// });


formRouter.post("/editForm", verifyJwt, async(req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, jwtKey);
        let formId = req.body.formId;
        let updatedForm = req.body.updatedForm;
        let rollNumber = data.rollNumber;
        if((roles.includes(data.role) || crRoles.includes(data.role)) && data.role != "student") {
            let result = await editForm(formId, rollNumber, updatedForm);
            if(result) return res.status(200).json({msg:'success'});
            return res.status(500).json({msg:'error while updating form'});
        }
        else return res.status(403).json({msg:'nice try diddy'});
    } catch(err) {
        return res.status(500).json({msg:'error'});
    }
});



module.exports = {formRouter};