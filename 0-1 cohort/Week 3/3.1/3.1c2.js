//same as 3.1c but used app.use() for all the middleware functions + added a middleware function to find the average time your server is taking to handle requests

//app.use ~ `app.use` is a special function that can be used to apply a middleware to all the routes
//Note: essence of what app.use(express.json()); does in your backend server code:
//When you write app.use(express.json()); in your backend server code like above, you're essentially telling the backend that I am expecting a request where the incoming request body is in the json format and also informing express that you please handle it ~ by handle i.e."handle it" in the context of express.json() it means that express by changing formats etc. will make it possible for us to use the incoming data coming from the client side in our backend code (on the server side)

const express = require("express");
const app = express();
let numberofRequests = 0;
let totalTimeTaken = 0;

//Creating the middleware function to count the number of incoming requests ~ Each time a request is made to the server, the count will increment
function calculateRequests(req, res, next){
  numberofRequests++;
  console.log(`1) Total number of incoming requests to the server = ${numberofRequests}`);
  next();
}

//Creating the middleware function to find the average time your server is taking to handle requests
function handleRequests(req, res, next){
  const startTime = Date.now(); //or can also use const startTime = new Date().getTime();
  res.on('finish',() => {
    const endTime = Date.now(); //or can also use const endTime = new Date().getTime();
    //console.log(`Total time taken by server to handle current request is ${endTime - startTime} milliseconds`);
    const timeElapsed = endTime - startTime;
    totalTimeTaken += timeElapsed;
    console.log(`2) Avg time taken by server to handle requests is ${totalTimeTaken/numberofRequests} milliseconds`);
  });
  next();
}

function userMiddleware(req, res, next){ //Middleware for username & password checks
  // Username verification for the given inputs.
  const username = req.headers.username;
  const password = req.headers.password;
  if (username != "vishal" || password != "pass") {
    res.status(403).json({
      message: "User doesn't exists!",
    });
    // Early return as we dont want to execute the rest of the code
    // since the user authentication failed.
    console.log('first middleware function itself failed');
    return;
  }
  console.log('3) userMiddleware done');
  next(); //next1
          // If the validation is successful, call the next middleware function using next(), i.e when next(); is hit next the control reaches inside the function that is right below next
          //When next(); is called within a middleware function in Express.js, the control reaches the next function in the chain. 
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
    console.log('only first middleware function passed second middleware function failed');
    return;
  }
  console.log('4) kidneyMiddleware done');
  next(); //next2
}
 
app.use(calculateRequests); 
app.use(handleRequests); 
app.use(userMiddleware);
app.use(kidneyMiddleware);

// Here, first the userMiddleware function will be executed and then the kidneyMiddleware function will execute.
app.get("/health-checkup-four", function (req, res){
    // Do something with kidney here
    //console.log('Both middleware functions passed now I am inside the route handler function');
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

app.listen(5002);

//observe carefully although he order given is app.use(calculateRequests); app.use(handleRequests); app.use(userMiddleware); app.use(kidneyMiddleware);
//but the output is in the order app.use(calculateRequests); app.use(userMiddleware); app.use(kidneyMiddleware); app.use(handleRequests);
//understand it better ⏬⏬⏬
//Breakdown of the code:
// app.use(calculateRequests);: This middleware runs first and increments the count of requests. It prints message 1) Total number of incoming requests to the server = 1.
// app.use(handleRequests);: This middleware starts, but it's asynchronous due to the res.on('finish') callback for calculating the average time. It starts measuring the time with startTime = Date.now().
// app.use(userMiddleware);: This middleware verifies username/password. If valid, it calls next(). It prints message 3) userMiddleware done.
// app.use(kidneyMiddleware);: This middleware validates kidneyId. If valid, it calls next(). It prints message 4) kidneyMiddleware done.
// Route handler starts: The route handler for the requested path executes (/health-checkup-four, "/replace-kidney-three", or /heart-check). It prints the message "Both middleware functions passed now I am inside the route handler function".
// Route handler sends response: The route handler sends the response (res.send()).
// handleRequests finishes: At this point, the response has been sent, and the res.on('finish') callback in handleRequests triggers. It calculates the average time using endTime = Date.now() and prints message 2) Avg time taken by server to handle requests is ... milliseconds.
// Important points:
// Middleware executions are sequential, but asynchronous operations within them (like res.on('finish')) are non-blocking.
// handleRequests calculates the average time after the response is sent, explaining why its message appears last, hence while the order of app.use declarations might seem to suggest the execution order, it's crucial to remember the asynchronous nature of the handleRequests middleware due to the res.on('finish') callback.
