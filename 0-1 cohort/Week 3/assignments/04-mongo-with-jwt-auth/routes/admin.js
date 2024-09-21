const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require('jsonwebtoken');
const jwt_Password = require('../index');
const { Admin, User, Course } = require("../db/index");

// Admin Routes
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    Admin.create({
        username: username,
        password: password
    }).then(function () {
        res.json({
            message: 'Admin created successfully'
        })
    }).catch(function () {
        res.json({
            message: 'Error encountered'
        })
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    // check if user with this 'username' already exists ~ for now assume that user always sends a unique username
    const verifyLogin = await Admin.find({
        username: username,
        password: password
    })
    if (verifyLogin) {
        const token = jwt.sign({ username: username }, jwt_Password);
        res.json({
            token //jwt
        });
    }
    else{
        res.status(403).json({
            message: "Admin doesn't exist in db, please re-check username/password"
          });
    }
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;