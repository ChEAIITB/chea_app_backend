const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

// const serviceAccount = require("../credentials/firebaseinfo.json");
const fs = require("fs");

const serviceAccount = JSON.parse(
    fs.readFileSync("/etc/secrets/firebaseinfo.json", "utf8")
);
const app = initializeApp({
    credential: cert(serviceAccount),
});

const messaging = getMessaging(app);

module.exports = {
    messaging
};