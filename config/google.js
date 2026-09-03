const { google } = require("googleapis");

// const keyFile = require("../credentials/sheetKey.json");
const fs = require("fs");

const keyFile = JSON.parse(
    fs.readFileSync("../../credentials/sheetKey.json", "utf8")
);
const auth = new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive"
    ]
});

module.exports = { auth };