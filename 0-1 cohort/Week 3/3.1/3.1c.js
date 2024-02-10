// Best Solution : create a middleware and use it in both routes - much more cleaner than 3.1b
//as here the routes(i.e. app.get("/health-checkup-four"..., app.get("/replace-kidney-three"..., app.get("/heart-check"...) now need to only worry about their own application logic and defer all the authentication checks to someone else in some other location altogether (~ these authentication checks here are done by middlewares in the form of function userMiddleware and function kidneyMiddleware)
//so here we have successfully separated the validation logic into reusable middleware functions (userMiddleware and kidneyMiddleware), improving code organization and maintainability when compared to 3.1b
//also here we are passing middleware functions as callback functions to the app.get() method ~ i.e. passing function userMiddleware and function kidneyMiddleware in the form of arguments inside app.get(....)

const express = require("express");
const app = express();

function userMiddleware(req, res, next){ //Middleware for username & password checks
  // Username verification for the given inputs.
  const username = req.headers.username;
  const password = req.headers.password;
  if (username != "soni" || password != "pass") {
    res.status(403).json({
      message: "User doesn't exists!",
    });
    // Early return as we dont want to execute the rest of the code
    // since the user authentication failed.
    return;
  }
  // If the validation is successful, call the next middleware function.
  next();
}

function kidneyMiddleware(req, res, next){ //Middleware for kidneyId check
  // Input validation for the given inputs.
  const kidneyId = req.query.kidneyId;
  if (kidneyId != 1 && kidneyId != 2) {
    res.status(411).json({
      message: "Wrong inputs!",
    });
    // Early return as we dont want to execute the rest of the code
    // since the user authentication failed.
    return;
  }
  // If the validation is successful, call the next middleware function.
  next();
}

// Here, first the userMiddleware function will be executed and then the kidneyMiddleware function will execute.
app.get("/health-checkup-four", userMiddleware, kidneyMiddleware, function (req, res){
    // Do something with kidney here
    res.send("You are healthy 😇");
  }
)

app.get("/replace-kidney-three", userMiddleware, kidneyMiddleware, function (req, res){
    // The kidney replacement logic will be written here.

    // If kidney replacement is successful.
    res.send("Your kidney has been replaced, you are healthy now!");
  }
)

// We can use the middleware functions in other routes as well.
// Here, we don't have to pass the kidneyMiddleware function for the heart check.
app.get("/heart-check", userMiddleware, function (req, res){
  // Do something with user here.
  res.send("Your heart is healthy 💖");
})





// In above routes, we had passed the middleware functions as arguments.
// If we want to apply a middleware function to all the routes, we can use app.use() function.
// All the middleware functions passed in the app.use() function will be applied for all the routes.