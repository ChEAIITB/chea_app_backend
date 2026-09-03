const { google } = require("googleapis");
require("dotenv").config({
    path:__dirname+"./../.env"
});
const fs = require("fs");
console.log(process.env.GOOGLE_TYPE);
const googleCredentials = {
  "type": process.env.GOOGLE_TYPE,
  "project_id": process.env.GOOGLE_PROJECT_ID,
  "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
  "private_key": process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  "client_email": process.env.GOOGLE_CLIENT_EMAIL,
  "client_id": process.env.GOOGLE_CLIENT_ID,
  "auth_uri": process.env.GOOGLE_AUTH_URI,
  "token_uri": process.env.GOOGLE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.GOOGLE_CLIENT_X509_CERT_URL,
  "universe_domain": process.env.GOOGLE_UNIVERSE_DOMAIN
};
// const keyFile = JSON.parse(
//     fs.readFileSync("./sheetKey.json", "utf8")
// );
const auth = new google.auth.GoogleAuth({
    credentials: googleCredentials,
    scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive"
    ]
});

module.exports = { auth };
