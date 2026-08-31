const mongoose = require("mongoose");


const runningCourseSchema = mongoose.Schema({
    cID : {
        type:String,
        required:true,
        unique:true
    },
    courseName:{
        type:String,
        required:true
    },
    courseCode:{
        type:String,
        required:true,
    },
    instructorName: {
        type:Array,
        required:true
    },
    term:{type:Number, required:true},
    tas : {type:Array, default:[]},
    cr:{
        type:[String],
        required:true,
    },
    division:String, // S1, S2, BOTH
    enrolledUsers: {
        type:Array,
        default:[]
    },
    createdAt: Number,
    createdById:{type:String, required:true},
    // isActive:{type:Boolean, default:true},
    attachments:{type:Array, default:[]},
    sem:{
        type:Number,
        required:true
    },
    timeslot:{
        type:Array,
        default:[] // like 3A, 3B etc
    },
    studentQueries :{
        type:Array,
        default:[]
    },
    profOfficeInfo:{
        type:String,
        default:""
    },
    courseDescription : {
        type:String,
        default:""
    },
    tasTiming:{
        type:String,
        default:""
    }
});


const announcementSchema = new mongoose.Schema({
    announcementId:{
        type:String,
        required:true,
        unique:true
    },
    cId:{
        type:String,
        required:true
    },
    createdById:{
        type:String,
        required:true
    },
    announcementText:{
        type:String,
        default:""
    },
    createdAt:{
        type:Number,
        required:true
    },
    isPoll:{
        type:Boolean,
        default:false
    },
    pollTitle:{
        type:String,
        default:""
    },
    pollOptions:{
        type:Array,
        default:[]
    },
    pollVotes:{
        type:Array,
        default:[]
    },
    targetUsers:{
        type:Array,
        default:[]
    },
    isAnonymous:{
        type:Boolean,
        default:false
    },
    attachments:{
        type:Array,
        default:[]
    },
});



module.exports = {runningCourseSchema, announcementSchema};