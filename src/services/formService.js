const mongoose = require("mongoose");

const {formSchema, formResponseSchema, googleSheetSchema} = require("./../schema/formSchema.js");
const { nanoid } = require("nanoid");
const { syncSheet, clearSheet, initializeSheet, addAccess } = require("./googleSheetService.js");
const e = require("express");
const { sendNotifs } = require("./notificationService.js");

const Form = new mongoose.model("ChEA_Form", formSchema);
const FormResponse = new mongoose.model("ChEA_FormResponse", formResponseSchema);
const GoogleSheet = new mongoose.model("ChEA_GoogleSheet", googleSheetSchema);

const getUserForm = async(rollNumber, startDate, endDate, isSubmitted, query) => {
    query = query?query:"";
    let forms = await Form.find({targetUsers : rollNumber,formTitle:{ $regex: query, $options: "i" }, formBody:{ $regex: query, $options: "i" },createdAt:{$gte:startDate, $lte:endDate}}).lean();
    forms.forEach((form, i) => {
        delete forms[i].targetUsers;
        delete forms[i].fields;
        delete forms[i].questionId;
        delete forms[i].googleSheetId;
        if(form.responseBy.includes(rollNumber)) {
            forms[i].responseBy = true;
        }
        else {
            forms[i].responseBy = false;
        }
        delete forms[i].submissionLimit;
        delete forms[i].createdById;
    });
    // console.log(forms, isSubmitted);
    if(isSubmitted==1) {
        forms = forms.filter(form => (form.responseBy)==true);
    }
    else if(isSubmitted==2) {
        forms = forms.filter(form => (form.responseBy)==false);
    }
    console.log(forms);
    return forms;
};


const getUserFormV2 = async(rollNumber, formId) => {
    let form = await Form.findOne({targetUsers : rollNumber, formId:formId}).lean();
    if(!form) return false;
    delete form.targetUsers;
    if(form.responseBy.includes(rollNumber)) form.hasResponded = true;
    delete form.submissionLimit;
    delete form.googleSheetId;
    delete form.responseBy;
    if(new Date().getTime() > form.expiresAt) {
        form.isExpired = true;
    }
    delete form.createdById;
    return form;
}


const createForm = async(rollNumber, formData, emailAccess, notif) => {
    console.log(emailAccess);
    const formId = nanoid(20);
    let targetUsers = formData.targetUsers;
    let t = new Date().getTime();
    formData.createdAt = t;
    let noOfQuestions = formData.noOfQuestions;
    let arrId = [];
    for(let i = 0;i<noOfQuestions;i++) {
        arrId[i] = nanoid(20);
        formData.fields[i].questionId = arrId[i];
    }
    formData.questionId = arrId;
    formData.createdById = rollNumber;
    const sheet = await GoogleSheet.findOneAndUpdate(
        { isTaken: false },
        {
            $set: {
                isTaken: true,
                takenFormId: formId
            }
        },
        { new: true }
    );
    if (!sheet) {
        console.log("this");
        return false;
    }
    const sheetId = sheet.sheetId;
    formData.googleSheetId = sheetId;
    formData.formId = formId;
    try {
        let result = await (new Form(formData)).save();
        let res2 = true;
        for(let i = 0;i<emailAccess.length;i++) {
            let a = await addAccess(emailAccess[i], sheetId);
            console.log(a, emailAccess[i]);
            if(!a) {
                res2 = false;
            }
            break;
        }
        
        console.log("res 2", res2);
        let row = [];
        row.push("LDAP");
        row.push("Time");
        for(let i = 0;i<formData.fields.length;i++) {
            row.push(formData.fields[i].fieldTitle);
        }
        console.log(formData);
        let aa = await initializeSheet(sheetId, row);
        console.log(aa);
        notif && await sendNotifs(formData.formTitle, formData.formBody, `/forms?id=${formId}`, '', targetUsers, rollNumber);
        if((!res2)  || (!aa)) {throw "hehe";};
        return res2;
    } catch(err) {
        console.log(err);
        await GoogleSheet.updateOne(
            { sheetId: sheet.sheetId },
            {
                $set: {
                    isTaken: false,
                    takenFormId: ""
                }
            }
        );
        await Form.deleteOne({formId:formId});
        return false;
    }
}


// There's a bug here, that we are not validating formData structure, students can introduce a custom structure and can fuck us badly

const submitForm = async(formData, rollNumber, formId) => {
    let myForm = await Form.findOne({formId:formId}).lean();
    const submissionCount = myForm.responseBy.filter(roll => roll === rollNumber).length;
    if(submissionCount>=myForm.submissionLimit) return false;
    let questionId = myForm.questionId;
    const answerId = nanoid(20);
    let t = new Date().getTime();
    let newArr = [];
    if(formData.length != myForm.noOfQuestions) return false;
    for(let i = 0;i<myForm.noOfQuestions;i++) {
        if(questionId.includes(formData[i].questionId)) newArr.push(formData[i]);
    }
    if(formData.length != newArr.length) return false;

    let formResponse = {
        answerId : answerId,
        answeredById : rollNumber,
        answers : formData,
        formId : formId,
        createdAt : t,
        duplicateId:submissionCount==0?0:submissionCount-1
    }
    try {
        let result1 = await (new FormResponse(formResponse)).save();
        let result2 = await Form.updateOne({formId:formId}, {
                    $addToSet: {
                        responseBy: rollNumber
                    }
                });
        syncSheet(myForm.googleSheetId, formData);
        return true;
    } catch(err) {
        return false;
    }
}; 

const getFormReponse = async(formId, page, limit) => {
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 20;
    let resp = await FormResponse.find({formId : formId})
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
    return resp;
}

const isSync = async(formId) => {
    let resp = await FormResponse.find({formId:formId, isSync:false}).lean();
    if(resp.length==0) return true;
    return false;
}

const syncResponses = async (formId, spreadsheetId) => {
    const resp = await FormResponse.find({
        formId,
        isSync: false
    }).lean();

    if (resp.length === 0) {
        return true;
    }

    const answers = resp.map(e => e.answers);

    const result = await syncSheet(spreadsheetId, answers);

    if (!result) {
        return false;
    }

    await FormResponse.updateMany(
        {
            _id: {
                $in: resp.map(e => e._id)
            }
        },
        {
            $set: {
                isSync: true
            }
        }
    );

    return true;
};


const getUserResponse = async(formId, rollNumber) => {
    let responses = await FormResponse.find({formId:formId, answeredById:rollNumber}).sort({createdAt:-1}).lean();
    return responses;
};

// const deleteForm = async(formId) => {
//     let result = await Form.deleteOne({formId:formId});
//     if(result.deletedCount == 1) {
//         return true;
//     }
// }

// is incomplete check gpt's last chat

const editForm = async(formId, rollNumber, updatedForm) => {
    let formResponses;
    let form = await Form.findOne({formId:formId, createdById:rollNumber});
const isSame =
    form.questionId.length === updatedForm.questionId.length &&
    form.questionId.every(
        (id, i) => id === updatedForm.questionId[i]
    );
        if(isSame) {
        let result = await Form.updateOne({formId:formId}, updatedForm);
        if(result.matchedCount == 1) return true;
    }
    else {
        // change the structure of form
        formResponses = await FormResponse.find({formId:formId}).lean();
        let questionIds = [];
        // Form structure update area
        for(let i = 0;i<updatedForm.questionId.length;i++) {
            questionIds[i] = updatedForm.questionId[i]=="new"?nanoid(20):updatedForm.questionId[i];
        }
        for(let i = 0;i<questionIds.length; i++) {
            updatedForm.fields[i].questionId = questionIds[i];
        }
        let fields = updatedForm.fields;
        updatedForm.questionId = questionIds;
        // responses update idhar
        formResponses.map((response, i) => {
            let newAns = [];
            for (let j = 0; j < fields.length; j++) {
                let found = false;
                let k = 0;

                for (k = 0; k < formResponses[i].answers.length; k++) {
                    if (
                        formResponses[i].answers[k].questionId ===
                        fields[j].questionId
                    ) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    newAns[j] = formResponses[i].answers[k];
                } else {
                    newAns[j] = {
                        ...fields[j],
                        response: ""
                    };
                }
            }
            formResponses[i].answers = newAns;
        });
        let flag = true;
        for(let i = 0;i<formResponses.length;i++) {
            let res = await FormResponse.updateOne({answerId:formResponses[i].answerId}, formResponses[i]);
            if(res.matchedCount != 1) return false;
        }
        let row = [];
        for(let i =0;i<updatedForm.fields.length;i++) {
            row[i] = updatedForm.fields[i].fieldTitle;
        }
        // spreadsheet updateTime

        let res = await Form.updateOne({formId:formId}, updatedForm);
        let a = await clearSheet(form.googleSheetId);
        let b = await initializeSheet(form.spreadsheetId, row);
        const answers = formResponses.map(e => e.answers);

        const c = await syncSheet(form.spreadsheetId, answers);
        if(a&&b&&c) return true;
    }
    return false;
};

module.exports = {getUserForm, getUserFormV2, createForm, submitForm, getFormReponse, isSync, syncResponses, getUserResponse, editForm};
