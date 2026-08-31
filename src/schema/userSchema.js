const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        unique: true,
        required: true
    },
    name: {type:String, required:true},

    role:{type:String, required:true},

    department: {type:String, required:true},

    batch: {type:String, required:true},

    createdAt:Number,

    linkedin: String,

    resume: String,

    profilePhoto: String,
    sem:{
        type:Number,
        defualt:1
    },

    enrolledCourses: {
        type: Array,
        ref: "RunningCourse",
        default:[]
    },
/**
    enrolledCourse : [{core:true, year : "", sem:"", isActive:bool, courseName, courseCode, cID}]
 */
    extraCourses : {
        type:Array,
        default:[]
    },
    // [courseCode...];
    exams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        default:[]
    }],

    receivedNotifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        default:[]
    }],

    sentNotifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        default:[]
    }],
    fcmCode : {
        type:String,
        default:""
    }
});


module.exports = {userSchema};