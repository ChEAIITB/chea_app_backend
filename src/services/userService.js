const mongoose = require("mongoose");
const {userSchema} = require("./../schema/userSchema");

const User = new mongoose.model("ChEA_User", userSchema);

const findUser = async(params) => {
    let res = await User.find(params).lean();
    delete res.sentNotifications;
    delete res.receivedNotifications;
    delete res.exams;
    delete res.role;
    return res;
};

const getUserFcm = async(targetList) => {
    let users = await User.find({ rollNumber: {
        $in: targetUsers
    }}).select("fcmCode rollNumber");
    return users;
};

const updateUser = async(params, updatedFields) => {
    let res = await User.updateOne(params, updatedFields);
    if(res.modifiedCount == 1) {
        return true;
    }
    else {
        return false;
    }
};  

const createUser = async(data) => {
    try {
        let res = await (new User(data)).save();
        return true;
    } catch(err) {
        return false;
    }
}

const findUserAdmin = async(params) => {
    let res = await User.findOne(params);
    return res;
}

const updateUserFCM = async(rollNumber, fcmCode) => {
    let result = await User.updateOne({rollNumber}, {$set:{fcmCode:fcmCode}});
    if(result.matchedCount == 1) return true;
    return false;
};

module.exports = {createUser, updateUser, findUser, findUserAdmin, getUserFcm, updateUserFCM};