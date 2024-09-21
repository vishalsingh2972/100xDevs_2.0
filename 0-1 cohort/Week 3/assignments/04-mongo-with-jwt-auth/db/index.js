const { mongodb_url2 } = require('../utils/constants');

// Import Mongoose Library
const mongoose = require('mongoose');

// Connect to MongoDB Database
mongoose.connect(mongodb_url2);

// Define Mongoose Schemas
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses:[{
        ref: 'Course',
        type: mongoose.Schema.Types.ObjectId       
    }]
});

const CourseSchema = new mongoose.Schema({
    title: String, 
    description: String, 
    price: Number, 
    imageLink: String
});

// Create Models/Tables/Collections in MongoDB database that will follow the Mongoose Schemas mentioned above
const Admin = mongoose.model('Admin2', AdminSchema);
const User = mongoose.model('User2', UserSchema);
const Course = mongoose.model('Course2', CourseSchema);


// Export Mongoose Models for Use in Other Files
module.exports = {
    Admin,
    User,
    Course
}