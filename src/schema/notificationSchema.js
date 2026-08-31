const mongoose = require("mongoose");



const notificationSchema = new mongoose.Schema(
    {
        notifId: {
            type: String,
            required: true,
            unique: true,
        },

        senderId: {
            type:String,
            required:true
        },

        targetUsers: {
            type:Array,
            default:[],
        },

        readedBy: {
            type: [String],
            default: [],
        },

        title: {
            type: String,
            required: true,
        },

        body: {
            type: String,
            required: true,
        },

        targetUrl: {
            type: String,
            default: "",
        },
        img:{
            type:String,
            default:""
        },
        successCount:{
            type:Number,
            required:true,
        },
        failureCount:{
            type:Number,
            required:true,
        },
        totalCount:{
            type:Number,
            required:true,
        }
    }
);

module.exports = {notificationSchema};