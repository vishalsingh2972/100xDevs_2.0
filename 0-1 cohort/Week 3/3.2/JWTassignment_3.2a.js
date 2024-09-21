//Assignment 1
//A website which has 2 endpoints:

//endpoint 1 - POST /signin which takes username and password as input from FE and Returns a json web token (JWT) with username encrypted
//endpoint 2 - GET /users which takes Authorization header or previosly returned JWT as input from FE and Returns an array of all users if user is signed in (token is correct) or Returns 403 status code if not

const express = require('express');
const app = express();
const port = 3000;

const jwt = require('jsonwebtoken');
const jwtPassword = "123456"; //secret key used for verifying the JWT's authenticity and is only known to the backend server

app.use(express.json());

//hamara in memory database for now
const ALL_USERS = [
  {
    username: "vishal@gmail.com",
    password: "123",
    name: "vishal singh",
  },
  {
    username: "raman@gmail.com",
    password: "456",
    name: "raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "789",
    name: "priya kumari",
  },
];

function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
  let userExists = false; //just assume initially
  for (let i = 0; i < ALL_USERS.length; i++) { //or can also do using find() to map through the array (tried below)
    if (ALL_USERS[i].username == username && ALL_USERS[i].password == password) {
      userExists = true;
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

  //jwt.sign ~ backend server generates a new token using this function
  var token = jwt.sign({ username: username }, jwtPassword); //this creates the token/JWT that is send back to the FE during the first user log in, also here by specifying the secret key (jwtPassword), you ensure that: Tokens are authentic and come from your trusted servers only.
  // console.log("JWT :",token);
  return res.json({
    // "JWT" : token
    token
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const verified = jwt.verify(token, jwtPassword); //jwt.verify ~ backend server verifies token using this function

    //When you call jwt.verify(), it decodes and verifies the token, and then returns the payload of the token, which is the middle part of the JWT (the data encoded within the token)
    // console.log(verified); console.log(verified.username); console.log(verified.iat);

    const username = verified.username;
    // return a list of users other than this username ~ basically, return everyone but themselves
    res.json({
      users: ALL_USERS.filter(function (user) {
        if (user.username == username) {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


/*
Here's a quick summary of how JWT is working:
- You send login credentials (username/password) to the server.
- The server authenticates your credentials.
- The server generates a JWT containing:
  Header (algorithm, token type)
  Payload (username, other user info)
  Signature (generated using the secret key)
- The server creates and stores a secret key (not transmitted to you) i.e here used as 'jwtPassword'.
- The server sends the JWT to you.

Subsequent Requests:
- You send the JWT with each request to the server.
- The server receives the JWT and extracts:
  Header
  Payload
  Signature
- The server uses the stored secret key to verify the signature.
- If verification succeeds:
  Server processes the request.
  Server sends a response back.

Key points:
- The secret key is generated and stored by the server, never transmitted to you.
- The secret key is used for signature verification, not for authentication.
- The JWT (header.payload.signature) is transmitted with each request.

Additional considerations:
Token expiration: JWTs can have an expiration time, after which they're considered invalid.
Token revocation: Implementing a token revocation mechanism to invalidate compromised tokens.
HTTPS: Using HTTPS ensures the JWT is transmitted securely.
*/ 
