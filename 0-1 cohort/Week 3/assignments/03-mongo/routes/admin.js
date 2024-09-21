const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();

// const express = require("express");
// const adminMiddleware = require("../middleware/admin");
// const router = express.Router();

// Admin Routes
//so this basically handles requests coming to /admin/signup
router.post('/signup', (req, res) => {
    // Implement admin signup logic
});

// ~ admin/courses
router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

// ~ admin/courses
router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;