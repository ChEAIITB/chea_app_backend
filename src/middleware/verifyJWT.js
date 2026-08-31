require("dotenv").config({path:__dirname+"./../../.env"});

const jsonwebtoken = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        let data = jsonwebtoken.verify(token, process.env.jwtKey);
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({
            msg: "Unauthorized"
        });
    }
};

module.exports = {verifyJwt};