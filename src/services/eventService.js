const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const {eventSchema} = require("./../schema/eventSchema.js");
const {sendNotifs} = require("./../services/notificationService.js")

const Event = new mongoose.model("ChEA_Events", eventSchema);

const getUserEvents = async(query, page, limit, rollNumber) => {
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 20;
    let events = await Event.find({targetUser:rollNumber, title:{ $regex: query, $options: "i" }})
                .sort({createdAt:-1})
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
    events.forEach((event, i) => {
        delete events[i].createdById;
        delete events[i].subtitle;
        delete events[i].targetUser;
        delete events[i].cta;
        delete events[i].participation;
        delete events[i].Attachments;
        delete events[i].attendance;
        delete events[i].attendanceConfirmedId;
        delete events[i].qrCodes;
        if(event.openedBy.includes(rollNumber)) {
            events[i].openedBy = true;
        }
        else {
            events[i].openedBy = false;
        }
        if(event.qrCodeScanned.includes(rollNumber)) {
            events[i].qrCodeScanned = true;
        }
        else {
            events[i].qrCodeScanned = false;
        }
        if(event.attendance&&event.attendanceConfirmedId.includes(rollNumber)) {
            events[i].attendanceConfirmedId = true;
        }
        else {
            events[i].attendanceConfirmedId = false;
        }
    });
    return events;
}


const getUserEventsV2 = async(eventId, rollNumber) => {
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 20;
    let event = await Event.find({eventId:eventId})
                .lean();
    if(event.length==1) {
        event = event[0];
        delete event.openedBy;
        delete event.createdById;
        delete event.targetUser;
        if(event.attendanceConfirmedId.includes(rollNumber)) {
            event.attendanceConfirmedId = true;
        }
        else {
            event.attendanceConfirmedId = false;
        }
        let a = false;
        if(event.qrFreebies) {
        for(let i = 0;i<event.qrCode.length;i++) {
            if(event.qrCode[i].rollNumber == rollNumber) {
                a = event.qrCode[i].qrCode;
                break;
            }
        }
        }
        if(event.qrCodeScanned.includes(rollNumber)) {
            event.qrCode = "";
            event.qrCodeScanned = true;
        }

        else {
            event.qrCodeScanned = false;
            event.qrCode = a;
        }
    }
    else {
        return {};
    }
    return event;
}

const deleteEvent = async(eventId) => {
    let res = await Event.deleteOne({eventId:eventId});
    if(res.deletedCount == 1) {
        return true;
    }
    else return false;
};


const editEvent = async(eventId, eventData) => {
    let res = await Event.updateOne({eventId:eventId}, eventData);
    console.log(res);
    console.log(eventData);
    if(res.matchedCount == 1) {
        return true;
    }
    else return false;
}

const updateQrScanned = async(eventId, rollNumber, userCode) => {
    let event = await Event.findOne({eventId:eventId});
    let flag = false;
    if(!event) {
        return false;
    }
    if(event.qrCodeScanned.includes(rollNumber)) {
        return false;
    }
    if((event.attendance && event.qrFreebies && event.attendanceConfirmedId.includes(rollNumber)) || event.qrFreebies) {

        for(let i = 0;i<event.qrCode.length; i++) {
            if(event.qrCode[i].rollNumber==rollNumber) {
                if((event.qrCode[i].qrCode==userCode)) {
                    flag = true;
                    break;
                }
            }
        }
        if(flag) {
            let result = await Event.updateOne(
                { eventId },
                {
                    $addToSet: {
                        qrCodeScanned: rollNumber
                    }
                }
            );
            if(result.modifiedCount == 1) return true;
            else return false;
        }
    }
    return false;
};

const addEvent = async(rollNumber, eventData) => {
    let qrCode = [];
    let targetUser = eventData.targetUser;
    if(eventData.qrFreebies) {
        for(let i = 0;i<eventData.targetUser.length;i++) {
            const code = nanoid(20);
            qrCode.push({rollNumber:eventData.targetUser[i], qrCode:code});
        }
        eventData.qrCode = qrCode;
    }
    if(eventData.attendance) {
        const code = nanoid(20);
        eventData.attendanceCode = code;
    }
    eventData.createdById = rollNumber;
    let eventId = nanoid(20);
    eventData.createdAt = new Date().getTime();
    eventData.eventId = eventId;
    try {
        let result = await (new Event(eventData)).save();
        await sendNotifs(eventData.eventName, eventData.title, `/forms?id=${eventId}`, eventData.coverImg, targetUser, rollNumber);

        return true;
    } catch(err) {

        console.log(err);
        return false;
    }
};

const markAttendance = async(rollNumber, eventId, attendanceCode) => {
    const result = await Event.updateOne(
        {
            eventId,
            attendanceCode
        },
        {
            $addToSet: {
                attendanceConfirmedId: rollNumber
            }
        }
    );

    return result.modifiedCount === 1;
}

module.exports = {getUserEvents, getUserEventsV2, deleteEvent, updateQrScanned, editEvent, addEvent, markAttendance};