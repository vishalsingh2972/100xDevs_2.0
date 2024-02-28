//Assignment 1
//A website which has 2 endpoints:

//endpoint 1 - POST /signin which takes username and password as input from FE and Returns a json web token (JWT) with username encrypted
//endpoint 2 - GET /users which takes Authorization header or previosly returned JWT as input from FE and Returns an array of all users if user is signed in (token is correct) or Returns 403 status code if not

const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456"; //secret key used for verifying the JWT's authenticity and is only known to the backend server

const app = express();
app.use(express.json());
const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];

function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
  let userExists = false; //just assume initially
  for(let i = 0; i<ALL_USERS.length; i++){
    if(ALL_USERS[i].username == username && ALL_USERS[i].password == password){
      userExists =  true;
    }
  }
  return userExists;
}

//using find()
// function userExists(username, password) {
//   let userExists = false;
//   const foundUser = ALL_USERS.find(user => {
//     if(user.username == username && user.password == password){
//       userExists = true;
//       console.log('Jai Ho');
//     }
//   });
//   return userExists;
// }

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword); //this creates the token/JWT that is send back to the FE during the first user log in
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    // return a list of users other than this username
    res.json({
      users: ALL_USERS.filter(function(user){
        if(user.username == username){
          return false; //This instructs the filter() method to exclude this user from the final array.
        }
        return true; //This tells the filter() method to include this user in the final array.
      })
    })
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token ji",
    });
  }
});

app.listen(3000)
