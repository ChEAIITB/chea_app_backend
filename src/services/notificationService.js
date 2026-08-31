const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const { messaging } = require("../../config/firebaseAdmin");

const {notificationSchema} = require("./../schema/notificationSchema.js");
const { getUserFcm } = require("./userService.js");

const Notification = new mongoose.model("ChEA_Notifications", notificationSchema);



const pushNotifs = async(title, body, targetUsers, targetUrl, img) => {
    try {
        const message = {
            tokens: targetUsers,

            notification: {
                title: title,
                body: body,
                imageUrl: img
            },

            data: {
                targetUrl: targetUrl
            }
        };

        const response = await admin.messaging()
        .sendEachForMulticast(message);
        console.log("Success:", response.successCount);
        console.log("Failed:", response.failureCount);
        return [response.successCount, response.failureCount];
    } catch(err) {return false;}
}

const sendNotifs = async(title, body, targetUrl, img, targetUsers, rollNumber) => {
    const notifId = nanoid(20);
    try {
        let users = await getUserFcm(targetUsers);
        let fcmIds = [];
        users.map((e) => {
            e.fcmCode!=""&&e.fcmCode&&fcmIds.push(e.fcmCode);
        });
        let res = await pushNotifs(title, body, fcmIds, targetUrl, img);
        if(res) {
            let notification = {
                notifId,
                senderId:rollNumber,
                targetUsers,
                readedBy:[],
                title,
                body,
                targetUrl,
                img,
                successCount:res[0],
                failureCount:res[1],
                totalCount:res[0]+res[1],
            };
            let result = await (new Notification(notification).save());
            return true;
        }
        return false;
    } catch(err) {
        return false;
    }
};

module.exports = {sendNotifs};