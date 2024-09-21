const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require('jsonwebtoken');
const { jwt_Password } = require('../config');
const { User, Course } = require("../db/index");

// User Routes
router.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.create({
        username: username,
        password: password
    }).then(function () {
        res.json({
            message: 'User created successfully'
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
    const verifyLogin = await User.findOne({
        username: username,
        password: password
    })
    if (!verifyLogin) {
        res.status(403).json({
          message: "User doesn't exist in db, please re-check username/password"
        });
      }
      else { //if user exists in db
        const token = jwt.sign({ username: username }, jwt_Password);
        res.json({
          token //jwt
        });
      }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({}); //Find all with no filtering conditions
    console.log(response);
    res.json({
        courses: response
    })
});

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router;