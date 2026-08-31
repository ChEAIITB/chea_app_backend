const mongoose = require("mongoose");

const {notificationSchema} = require("./../schema/notificationSchema.js");

const Notifications = new mongoose.model("ChEA_notifications", notificationSchema);


const getUserNotifs = async(id, page, limit, rollNumber) => {
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 20;
    const objectId = new Types.ObjectId(id);
    let notifs = await Notifications.find({_id:objectId})
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
    notifs.forEach((notif, i) => {
        delete notifs[i].senderId;
        delete notifs[i].targetUsers;
        delete notifs[i].targetUsers;
        if(notif.readedBy.includes(rollNumber)) {
            notifs[i].readedBy = true;
        }
        else {
            notifs[i].readedBy = false;
        }
    });
    return notifs;
}

module.exports = {getUserNotifs};