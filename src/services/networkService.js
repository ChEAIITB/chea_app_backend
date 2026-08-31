const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const {networkSchema} = require("./../schema/networkSchema.js");

const Network = new mongoose.model("ChEA_Network", networkSchema);

const findNetwork = async(name, domain, status, company, page, limit) => {
    let networks = await Network.find({company:{
        $regex: company,
        $options: "i"
    }, status:{
        $regex: status,
        $options: "i"
    }, domain:{
        $regex: domain,
        $options: "i"
    }, name: {
        $regex: name,
        $options: "i"
    }})
    .sort({createdAt : -1})
    .skip((page - 1) * limit)
                .limit(limit)
                .lean();
    return networks;
};

const findNetworkV2 = async(nId) => {
    let networks = await Network.find({nId:nId})
                .lean();
    return networks;
};


const editNetwork = async(nId, newData) => {
    let result = await Network.updateOne({nId:nId}, newData);
    if(result.matchedCount == 1) return true;
    else return false;
}

const addNetwork = async(networkData, rollNumber) => {
    try {
        const networkId = nanoid(20);
        networkData.nId = networkId;
        networkData.createdById = rollNumber;
        networkData.createdAt = new Date().getTime();
        let res = await (new Network(networkData)).save();
        return true;
    } catch(err) {
        console.log(err);
        return false;
    }
};

const deleteNetwork = async(nId) => {
    let result = await Network.deleteOne({nId:nId});
    if(result.deletedCount == 1) return true;
    else return false;
}

module.exports = {findNetwork, editNetwork, addNetwork, deleteNetwork, findNetworkV2};