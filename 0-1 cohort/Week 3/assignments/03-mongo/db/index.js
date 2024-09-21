// Import Mongoose Library
const mongoose = require('mongoose');

// Connect to MongoDB Database
mongoose.connect('your-mongodb-url');

// Define Mongoose Schemas
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCoures:[{
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
const Admin = mongoose.model('Admin1', AdminSchema); //Model Instance Creation: you use Admin to create new admin objects/instances, e.g., Admin.create(), new Admin(). //Collection Name in MongoDB: The corresponding collection/table name in your MongoDB database here will be 'Admin1', not Admin.
const User = mongoose.model('User1', UserSchema);
const Course = mongoose.model('Course1', CourseSchema);


// Export Mongoose Models for Use in Other Files
module.exports = {
    Admin,
    User,
    Course
}