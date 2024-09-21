// Middleware for handling admin authentication
const jwt = require('jsonwebtoken');
const { jwt_Password } = require('../config');

function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization; // Bearer token

    //token ~ Bearer agdgvdggdgvdgvd => ["Bearer", "agdgvdggdgvdgvd"]
    const words = token.split(" "); //make string to array of substrings ~ ["Bearer","token"]
    const our_jwt = words[1]; // token
    // console.log(our_jwt);
    try {
        const verifiedValue = jwt.verify(our_jwt, jwt_Password);//When you call jwt.verify(), it decodes and verifies the token, and then returns the payload of the token, which is the middle part of the JWT (the data encoded within the token), so now verifiedValue = payload part of the jwt

        if (verifiedValue.username) {
            next();
        }
        else {
            res.status(403).json({
                msg: "Admin authentication failure"
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = adminMiddleware;