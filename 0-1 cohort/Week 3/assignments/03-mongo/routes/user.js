const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index");

// User Routes
// ~ user/signup
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    // check if user with this 'username' already exists ~ for now assume that user always sends a unique username
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

// ~ user/courses
router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({}); //Find all with no filtering conditions
    console.log(response);
    res.json({
        courses: response
    })
});

// ~ user/courses/:courseId
router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;

    const username = req.headers.username;
    const password = req.headers.password;
    User.updateOne({
        username: username,
        password: password,
    },{
        $push: { purchasedCourses: courseId } //"$push": { purchasedCourses: courseId } even this works
    }).catch(function(e){
        console.log(e);
    })
    res.json({
        message: 'Course purchased successfully'
    })
});

// ~ user/purchasedCourses
router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.headers.username,
        password: req.headers.password
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
