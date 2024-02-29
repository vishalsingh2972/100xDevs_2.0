//Databases

//NoSQL Database - MongoDB
//How does the backend connect to the database? - Using libraries! - Mongoose is one of the library that lets us connect our backend to the database

//Mongoose
//Simple code that lets me write to the MongoDB database using (mongoose)
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

const User = mongoose.model('Users', { name: String, email: String, password: String });

const user = new User({ 
  name: 'Vishal Singh', 
  email: 'tugrp@example.com', 
  password: '123456' 
});

user.save();