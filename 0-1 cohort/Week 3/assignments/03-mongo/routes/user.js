const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");

// User Routes
// ~ user/signup
router.post('/signup', (req, res) => {
    // Implement user signup logic
});

// ~ user/courses
router.get('/courses', (req, res) => {
    // Implement listing all courses logic
});

// ~ user/courses/:courseId
router.post('/courses/:courseId', userMiddleware, (req, res) => {
    // Implement course purchase logic
});

// ~ user/purchasedCourses
router.get('/purchasedCourses', userMiddleware, (req, res) => {
    // Implement fetching purchased courses logic
});

module.exports = router