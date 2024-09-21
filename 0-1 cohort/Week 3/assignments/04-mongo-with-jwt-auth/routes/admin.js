const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require('jsonwebtoken');
const { jwt_Password } = require('../config');
const { Admin, Course } = require("../db/index");

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
    const verifyLogin = await Admin.findOne({
        username: username,
        password: password
    })
    if (!verifyLogin) {
        res.status(403).json({
          message: "Admin doesn't exist in db, please re-check username/password"
        });
      }
      else { //if user exists in db
        const token = jwt.sign({ username: username }, jwt_Password);
        res.json({
          token //jwt
        });
      }
});

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
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({}); //Find all with no filtering conditions
    console.log(response);
    res.json({
        courses: response
    })
});

module.exports = router;