// Adding Middlewares - UGLY WAYS: 2) Using functions (adding common MIDDLEWARE functions)
//3.1b is better than 3.1a but still ugly (~ 3.1b is still kind of VIOLATION of DRY principle)

const express = require("express");
const app = express();

function usernameValidator(username, password){ //common MIDDLEWARE function for all routes
  if (username != 'dexter' || password != 'pass') {
      return false;
  }
  return true;
}

function kidneyValidator(kidneyId){ //common MIDDLEWARE function for all routes
  if(kidneyId == 1 || kidneyId == 2) return true;
  return false; 
}

app.get('/health-checkup', (req, res) => {
  if (!usernameValidator(req.headers.username, req.headers.passward)) {
      res.status(400).json({
        msg : "user doesn't exist, please enter the correct username/password",
      });
  return;
  }
  if(kidneyValidator(req.query.kidneyId)){
      res.status(400).json({
          msg : "wrong inputs, please enter the correct kidneyId",
      });
  return;
  }
  res.status(200).json({
    msg : "Your Kidneys are fine"
  })
  console.log("sab badiya");
});

app.post('/replace-kidney', (req, res) => {
  if (!usernameValidator(req.headers.username, req.headers.passward)) {
      res.status(403).json({
        msg : "user doesn't exist, please enter the correct username/password",
      });
  return;
  }
  if(kidneyValidator(req.query.kidneyId)){
      res.status(411).json({
        msg : "wrong inputs, please enter the correct kidneyId",
      });
  return;
  }
  res.status(200).json({
    msg : "Your Kidneys are fine"
  })
  console.log("sab badiya");
});

app.listen(5000);

//To make the above solution - 3.1b more better, we enhance the middleware functions in 3.1c
//These functions will perform the complete validation and send the response.
//So, the only thing that remains in the request body is the kidney replacement logic and the final response.
//This makes the code more shorter, cleaner and readable.
//we do all this in 3.1c, go check 3.1c next