const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
    {
        formId: {
            type: String,
            required: true,
            unique: true,
        },

        targetUsers: {
            type: [String],
            default: [],
        },
        questionId:{
            type:Array,
            default:[]
        },
        fields: {
            type: Array,
            default: [],
        },

        responseBy: {
            type: [String],
            default: [],
        },

        expiresAt: {
            type: Number,
            required: true,
        },

        formUrl: {
            type: String,
            default: "",
        },

        formTitle: {
            type: String,
            required: true,
        },

        formBody: {
            type: String,
            default: "",
        },

        createdById: {
            type: String,
            required: true,
        },
        createdAt: {
            type:Number,
            required:true
        },
        googleSheetId:{
            type:String,
            default:""
        },
        submissionLimit:{
            type:Number,
            default:1,
            required:true
        }
    }
);


const formResponseSchema = new mongoose.Schema(
    {
        answerId: {
            type: String,
            required: true,
            unique: true,
        },

        answeredById: {
            type: String,
            required: true,
        },

        answers: {
            type: Array,
            default: [],
        },

        formId: {
            type: String,
            required: true,
        },
        createdAt:{
            type:Number,
            required:true
        },
        isSync:{
            type:Boolean,
            required:true,
            default:false
        },
        duplicateId:{
            type:Number,
            default:0
        }
    }
);

const googleSheetSchema = new mongoose.Schema({
    sheetId:{
        type:String,
        required:true,
        unique: true
    },
    isTaken:{
        type:Boolean,
        default:false
    },
    takenFormId:{
        type:String,
        default:""
    }
});


module.exports = {formSchema, formResponseSchema, googleSheetSchema};