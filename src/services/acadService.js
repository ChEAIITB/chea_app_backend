const mongoose = require("mongoose");
const {runningCourseSchema, announcementSchema} = require("./../schema/courseSchema.js");
const { nanoid } = require("nanoid");
const { sendNotifs } = require("./notificationService.js");

const RunningCourse = new mongoose.model("RunningCourse", runningCourseSchema);
const Announcement = new mongoose.model("ChEA_Announcements", announcementSchema);

const getRunningCourses = async(rollNumber, year, sem, division) => {
    let courses = await RunningCourse.find({enrolledUsers:rollNumber, sem:sem, term:year, division: { $in: [division] }}).lean();
    courses.forEach((e, i) => {
        delete courses[i].announcements;
        delete courses[i].cr;
        delete courses[i].enrolledUsers;
        delete courses[i].createdAt;
        delete courses[i].createdById;
        delete courses[i].attachments;
        delete courses[i].studentQueries;
        delete courses[i].profOfficeInfo;
        delete courses[i].courseDescription;
        delete courses[i].tasTiming;
        
    });
    return courses;
}

const getCourseInfo = async(rollNumber, cId, isAdmin) => {
    let course = await RunningCourse.findOne({enrolledUsers:rollNumber, cId:cId});
    if(!isAdmin) {
        delete course.enrolledUsers;
        delete course.studentQueries;
    }
    return course;
};

const addRunningCourse = async(rollNumber, courseInfo, division) => {
    courseInfo.division = division;
    courseInfo.createdById = rollNumber;
    courseInfo.createdAt = new Date().getTime();
    courseInfo.cId = nanoid(20);
    try {
        let course = await (new RunningCourse(courseInfo)).save();
        return true;
    } catch(err) {
        return false;
    }
};

const editRunningCourse = async(rollNumber, cId, division, updatedData) => {
    let result = await RunningCourse.updateOne({createdById:rollNumber, cId:cId, division:division}, updatedData);
    if(result.matchedCount == 1) return true;
    else return false;
};

const getAnnouncements = async(cId, page, limit, rollNumber) => {
    let announcements = await Announcement.find({cId:cId, targetUser:rollNumber})
                .sort({createdAt:-1})
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
    announcements.forEach((notif, i) => {
        delete announcements[i].targetUser;
        if(announcements[i].isAnonymous) {
            announcements[i].pollVotes.map((votes, j) => {
                announcements[i].pollVotes[j].noOfVotes = announcements[i].pollVotes[j].votedBy.length;
                announcements[i].pollVotes[j].votedBy = [];
            });
        }
    });
    return announcements;
}

const addAnnouncement = async(cId, announcementData, rollNumber, courseCode) => {
    let announcementId = nanoid(20);
    let targetUser = announcementData.targetUsers;
    let announcement = {
        ...announcementData,
        cId : cId,
        announcementId:announcementId,
        createdAt:new Date().getTime(),
        createdById:rollNumber
    };
    try {
        let result = await (new Announcement(announcement)).save();
        let res = await sendNotifs(courseCode, 'Course Announcement', `/course/announcement?cId=${cId}`, '', targetUser, rollNumber);
        if(res)
            return announcementId;
        return false;
    } catch(err) {
        return false;
    }
};

const updateAnnouncement = async(announcementId, updatedData, rollNumber) => {
    let result = await Announcement.updateOne({announcementId:announcementId, createdById:rollNumber}, updatedData);
    if(result.matchedCount==1) {
        return true;
    }
    return false;
}


const deleteAnnouncement = async(announcementId, rollNumber) => {
    let result = await Announcement.deleteOne({announcementId:announcementId, createdById:rollNumber});
    if(result.deletedCount==1) {
        return true;
    }
    return false;
}


module.exports = {getRunningCourses, getCourseInfo, addRunningCourse, editRunningCourse, getAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement}
