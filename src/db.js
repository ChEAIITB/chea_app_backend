const mongoose = require("mongoose");
require("dotenv").config({path:__dirname+"./../.env"});
const dbUrl = process.env.db_url;
const connectDB = () => {
    // console.log(dbUrl);
    console.log("db connection initiated");
    try {
        mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 10000,
    family: 4
})
        .then(() => {console.log("DB CONNECTED");})
        .catch(err => {console.log("failed to connect to db", err);});
    } catch(err) {
        console.log("err at db connection");
    }
};

module.exports = {connectDB};