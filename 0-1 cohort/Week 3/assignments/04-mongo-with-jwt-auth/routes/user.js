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
    const courseId = req.params.courseId;

    const username = req.headers.username;
    //console.log(username);

    User.updateOne({
        username: username,
    },{
        $push: { purchasedCourses: courseId } //"$push": { purchasedCourses: courseId } even this works
    }).catch(function(e){
        console.log(e);
    })
    res.json({
        message: 'Course purchased successfully'
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username
    })
    // console.log(user.purchasedCourses); // gives array of purchased courseIds of the user
    // res.json({
    //     courses: user.purchasedCourses
    // })

    //basically scan through the 'Course' table, find the courses whose IDs match with the IDs present in user.purchasedCourses and Return the full details of these matching courses
    const purchased_courses = await Course.find({
        _id: { $in: user.purchasedCourses }
    })
    res.json({
        kharida_hua_maal: purchased_courses
    })
});

module.exports = router;