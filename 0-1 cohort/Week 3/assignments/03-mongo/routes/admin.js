const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");
const router = Router();

// const express = require("express");
// const adminMiddleware = require("../middleware/admin");
// const router = express.Router();

// Admin Routes
//so this basically handles requests coming to /admin/signup
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    // check if user with this 'username' already exists ~ for now assume that user always sends a unique username
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

// ~ admin/courses - POST
router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    // const newCourse = Course.create({ //for this to work remove 'async' from top
    //     title: title,
    //     description: description,
    //     price: price,
    //     imageLink: imageLink
    // }).then(function () {
    //     res.json({
    //         message: 'Course created successfully', courseId: newCourse._id
    //     })
    // })

    const newCourse = await Course.create({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink
    })
    console.log(newCourse);
    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
})

// ~ admin/courses - GET
router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({}); //Find all with no filtering conditions
    console.log(response);
    res.json({
        courses: response
    })
});

// router.get('/courses', adminMiddleware, (req, res) => {
//     // Implement fetching all courses logic
//     Course.find({}).then(function(response){
//         console.log(response);
//         res.json({
//             courses: response
//         })
//     })
// });

module.exports = router;