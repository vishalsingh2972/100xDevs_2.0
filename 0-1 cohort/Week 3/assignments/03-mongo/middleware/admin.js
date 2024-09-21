//interact with list of db instances present in the 'Admin1' table/collection using the Admin i.e the one which we initially used to create these instances in the table using Admin.create()...
const { Admin } = require("../db/index");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const username = req.headers.username;
    const password = req.headers.password;

    Admin.findOne({
        username: username,
        password: password
    }).then(function(value){
        if (value){
            next();
        }
        else{
            res.status(403).json({
                msg: "Admin not found in db, please re-check username/password"
            })
        }
    })
}

module.exports = adminMiddleware;