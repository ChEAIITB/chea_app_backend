const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
        },
        openedBy:{
            type:[String], //ldap
            default:[]
        },
        eventName: {
            type: String,
            required: true,
        },
        coverImg: {
            type:Array,
            default:[]
        },
        createdById: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },

        subtitle: {
            type: String,
            default: "",
        },

        body: {
            type: String,
            required: true,
        },

        targetUser: {
            type: [String], //ldap
            default: [],
        },

        cta: {
            type: Array,
            default: [],
        },

        participation: {
            type: Boolean,
            default: false,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        Attachments: {
            type: Array,
            default: [],
        },

        attendance: {
            type: Boolean,
            default: false,
        },
        eventDate: {
            type: String,
            required: true,
        },

        eventTag: {
            type: String,
            required: true,
        },
        attendanceCode:{
            type:String,
            default:""
        },
        attendanceConfirmedId: {
            type: [String],
            default: [],
        },
        qrFreebies : {
            type:Boolean,
            default:false
        },
        qrCode:{
            type:Array, // [{rollNumber:, userCode:}, ....]
            default:[]
        },
        qrCodeScanned:{
            type:Array,
            default:[] // roll number
        },
        createdAt:{
            type:Number,
            required:true
        }
    }
);


module.exports = {eventSchema};
