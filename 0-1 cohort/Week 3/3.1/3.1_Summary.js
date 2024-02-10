// Understanding middlewares with help of hospital example during the pandemic season.
// To visit the doctor for a health checkup, a patient would have to undergo some tasks before.
// These tasks include document verification, medical history, BP/Blood/temperature checkups etc.
// Consider these tasks as requests waiting to get processed by the server(hospital staff).
// In terms of code, it would look like:

// Importing the NodeJS module called as ExpressJS to create server.
const express = require("express");
// Create an instance of express server.
const app = express();
// Importing the Zod library for input validation.
const zod = require("zod");

app.get("/health-checkup-one", function (req, res) {
  // Perform the health checkups here and then proceed.
  res.send("You are healthy!");
});

// Now, either we can include the health checkups in the code above itself or
// create separate function for each checkup and then directly call them.
// This is where middlewares come into picture.
// Middlewares are used to perform pre-checks in the program like authentication and user input validation.

// For this example the pre-checks would look like:
// Authentication checks - does the user have enough funds to visit the doctor?
// Input validation - does the user have BP/Blood/temperature checkup reports to show to the doctor.

// Let's add some constraints before proceeding. This will help to understand the need of middlewares.
// User needs to send a kidneyId as a query param which should be a number from 1-2 (humans only have 2 kidneys).
// User should send a username and password in headers.

app.get("/health-checkup-two", function (req, res) {
  // Performing health checkups. These are the inputs.
  const username = req.headers.username;
  const password = req.headers.password;
  const kidneyId = req.query.kidneyId;
  // Username verification for the given inputs.
  if (username != "soni" || password != "pass") {
    res.status(403).json({ msg: "User doesn't exists!" });
    // Early return as we dont want to execute the rest of the code
    // since the user authentication failed.
    return;
  }
  // Input validation for the given inputs.
  if (kidneyId != 1 && kidneyId != 2) {
    res.status(411).json({ msg: "Wrong inputs!" });
    return;
  }

  // If all health checkups are successful.
  res.json({
    msg: "Your kidney is fine!",
  });
});

// Next task is to add a new route that does kidney replacement and the inputs need to be same as the health checkup route.
app.get("/replace-kidney-one", function (req, res) {
  // Performing health checkups. These are the inputs.
  const kidneyId = req.query.kidneyId;
  const username = req.headers.username;
  const password = req.headers.password;
  // Username verification for the given inputs.
  if (username != "soni" || password != "pass") {
    res.status(403).json({
      message: "User doesn't exists!",
    });
    // Early return as we dont want to execute the rest of the code
    // since the user authentication failed.
    return;
  }
  // Input validation for the given inputs.
  if (kidneyId != 1 && kidneyId != 2) {
    res.status(411).json({
      message: "Wrong inputs!",
    });
    return;
  }
  // The kidney replacement logic will be written here.

  // If kidney replacement is successful.
  res.send("Your kidney has been replaced, you are healthy now!");
});

// The above solution for kidney replacement was ugly because of repetition of code.
// The /health-checkup-two code and the /replace-kidney-one look almost similar.
// To make it look better, we can define functions for the common tasks of both routes.

// The username validation and the input validation for kidney appaears same in both routes.
// To avoid writing them again completely, define functions for both separately.
// These functions can then be passed in the request body to make the code look short and better.
// These functions are called the middleware functions.

function usernameValidator(username, password) {
  if (username != "soni" || password != "pass") {
    return false;
  }
  return true;
}

function kidneyValidator(kidneyId) {
  if (kidneyId != 1 && kidneyId != 2) {
    return false;
  }
  return true;
}

app.get("/health-checkup-three", function (req, res) {
  // Performing health checkups. These are the inputs.
  const username = req.headers.username;
  const password = req.headers.password;
  const kidneyId = req.query.kidneyId;
  // Username verification for the given inputs.
  if (!usernameValidator(username, password)) {
    res.status(403).json({
      message: "User doesn't exists!",
    });
    return;
  }
  // Input validation for the given inputs.
  if (!kidneyValidator(kidneyId)) {
    res.status(411).json({
      message: "Wrong inputs!",
    });
    return;
  }
  // If all health checkups are successful.
  res.json({
    msg: "Your kidney is fine!",
  });
});

app.get("/replace-kidney-two", function (req, res) {
  // Performing health checkups. These are the inputs.
  const kidneyId = req.query.kidneyId;
  const username = req.headers.username;
  const password = req.headers.password;
  // Username verification for the given inputs.
  if (!usernameValidator(username, password)) {
    res.status(403).json({
      message: "User doesn't exists!",
    });
    return;
  }
  // Input validation for the given inputs.
  if (!kidneyValidator(kidneyId)) {
    res.status(411).json({
      message: "Wrong inputs!",
    });
    return;
  }
  // The kidney replacement logic will be written here.

  // If kidney replacement is successful.
  res.send("Your kidney has been replaced, you are healthy now!");
});

// Best Solution : create a middleware and use it in both routes
// To make the above solution more better, we enhance the middleware functions.
// These functions will perform the complete validation and send the response.
// So, the only thing that remains in the request body is the kidney replacement logic and the final response.
// This makes the code more shorter, cleaner and readable.

// While making API requests, we can pass any number of functional parameters.
// These functional parameters work as middlewares to make our work easier.
// The order of the middleware functions is important when writing the code.
// The function which is written first will be executed first.

// While defining a middleware function, the important parameters are request, response and next.
// Request is the HTTP request same that is passed to the API to get the data.
// Response is the HTTP reponse same that is expected to be returned from the API.
// Next is a callback function that is used to call the next middleware function.

function userMiddleware(req, res, next) {
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

function kidneyMiddleware(req, res, next) {
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

// In the route, we are passing the middleware functions as arguments for the validation tasks.
// Here, first the userMiddleware function will be executed and then the kidneyMiddleware function will execute.
app.get(
  "/health-checkup-four",
  userMiddleware,
  kidneyMiddleware,
  function (req, res) {
    // Do something with kidney here
    res.send("You are healthy!");
  }
);

app.get(
  "/replace-kidney-three",
  userMiddleware,
  kidneyMiddleware,
  function (req, res) {
    // The kidney replacement logic will be written here.

    // If kidney replacement is successful.
    res.send("Your kidney has been replaced, you are healthy now!");
  }
);

// We can use the middleware functions in other routes as well.
// Here, we don't have to pass the kidneyMiddleware function for the heart check.
app.get("/heart-check", userMiddleware, function (req, res) {
  // Do something with user here.
  res.send("Your heart is healthy!");
});

// In above routes, we had passed the middleware functions as arguments.
// If we want to apply a middleware function to all the routes, we can use app.use() function.
// All the middleware functions passed in the app.use() function will be applied for all the routes.

// This middleware helps us to parse the body of the request as a json.
// Generally used to parse the body of POST requests.
app.use(express.json());
// This middleware helps us to parse the body of the request as a url encoded string.
app.use(express.urlencoded({ extended: true }));

// The above two middlewares will be applied to all the routes.

app.get("/health-checkup-five", function (req, res) {
  // Do something with kidney here
  res.send("You are healthy!");
});

// We can add a path to the app.use() function to apply the middleware to only those routes that match the path.
// Let's apply the middleware to all the routes that start with /health-checkup.
app.use("/health-checkup-five", userMiddleware, kidneyMiddleware);

// The backend servers are hosted on the internet and are accessed by many users.
// They always look for valid input to return the response to the user. But a user can give any type of input and make the server crash.
// The error messages shown by the backend code are quite long and not every user can understand.
// To avoid error messages, input validation is needed.
// One way is to use conditionals to check the input type and content.
// But it is a long task because there might be multiple conditionals needed till the server recieves the perfect input.
// Another way is to use global catches. It is a middleware that helps in error handling.
// Global catches should be defined after all the routes so that any time an exception occurs in any route, the middleware will get called.
// Global catches take 4 inputs. The extra input is the error message that needs to be shown to the user.

app.use(function (err, req, res, next) {
  res.json({
    msg: "Something's wrong with the server!",
  });
});

// The above global catch was a general example. In real world, multiple checks are needed to be done for the input validation.
// This is where Zod comes into picture. It helps to check user input based on the data type.
// It checks the data type of the input that the server needs and the data type of the user input.
// Using zod makes easy for the developer to perform input validation. The tricky part here is to define the schema.
// First step is to install it and then import it(already done on line 12).

// Next create a schema to define the type of user input.
// Creating a schema for array of numbers.
const schema = zod.array(zod.number());

// To validate the user input, parse it with the schema defined inside the route.
app.post("/health-checkup", function (req, res) {
  // Extract the kidneys values from the input.
  const kidneys = req.body.kidneys;
  // Parse it to compare with schema defined earlier and store the value in response.
  // If the schema type and the data type of the kidneys match, it will return success as true else false.
  const reponse = schema.safeParse(kidneys);
  // If don't match, send response to user stating invalid input.
  if (!response.success) {
    res.status(411).json({
      msg: "Invalid input!",
    });
    return;
    // If match, let the user see what was the response.
  } else {
    res.send({ response });
  }
});

// Running the server on port 3000.
app.listen(3000);