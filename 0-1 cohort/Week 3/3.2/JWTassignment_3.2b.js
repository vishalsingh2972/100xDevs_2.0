//Assignment 2
//Similar as Assignment 1 but here instead of storing data in memory we have added Mongoose integration i.e connected the backend server to the MongoDB database via the mongoose library

//Enpoints
// 1)/signup - put new user details(username,password,firstname) into the database provided only if same username doesn't already exist in the DB 
// 2)/signin - backend needs to check if the user already exists in the DB and is their password correct - only if all pass we return the user back with a JWT
// 3)/users -  we input the header(containing the JWT), backend checks the JWT if all correct it hits the DB gets the user data and sends it back to the FE
// so in short here we will learn how a backend application talks/interacts with a MongoDB database +  we are using Mongoose library here for interacts between the backend and the MongoDB database

// require('dotenv').config();
// const mongo_url = process.env.MONGO_URL;

const express = require('express');
const app = express();
const port = 9999;

const jwt = require("jsonwebtoken");
const jwtPassword = "123456";
app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect(
  // mongo_url ~ via .env file
  'your_mongo_url'
);

const User = mongoose.model("Users", {
  name: String,
  email: String,
  password: String,
});

app.post("/signup", async function (req, res) {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  //avoid creating duplicates ~ first check if user with same creds already exists or not only then add otherwise don't add this user
  const existingUser = await User.findOne({ email: username });
  if(existingUser){
    return res.status(400).send("Username is already taken, try something else!");
  }

  const user = new User({
    name: name,
    email: username,
    password: password
  });
  user.save().then(() => console.log('new user added to database'));

  res.json({
    "message": "User created successfully"
  })
});

app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, "shhhhh");
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    // return a list of users other than this username from the database
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});