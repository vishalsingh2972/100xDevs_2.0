// Adding Middlewares - UGLY WAYS: 1) Using If/Else checks
//This is acceptable for one route but leads to repetition in cases of multiple routes requiring the same check (VIOLATION of DRY principle) and also is limited to only one file.

const express = require("express");
const app = express();
const port = 5000;

app.get("/health-checkup", function(req,res){

  //do health checks here ---> Middlewares part 
  //Middleware start
  const kidneyId = req.query.kidneyId;
  const username = req.headers.username;
  const password = req.headers.password; 

  if(kidneyId != 1 && kidneyId != 2){ //Input validation 
    res.status(400).json({
      msg : "wrong inputs, please enter the correct kidneyId"
    })
    return; //early returning - This is a common programming practice where a function exits prematurely if specific conditions are met instead of executing the entire function body, so here the return; statement is encountered, the function immediately exits without executing any further code.
  }

  if(username != "vishal" || password != "krishna"){ //Username & Password checks //can also be written as if(!(username === "vishal" && password === "krishna")){
    res.status(403).json({
      msg : "user doesn't exist, please enter the correct username/password"
    })
    return; //early returning
  }//Middleware end

  //do something with kidney here
  res.send("You are Healthy");
  console.log("sab badiya");
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Now if I want to do another operation like kidney replacement, I need to introduce another route like:
// app.post("/kidney-replacement", function(req,res){ 
    // if(kidneyId != 1 && kidneyId != 2){....}  
    // if(username != "vishal" || password != "krishna"){....} ....})
//so as you can see this leads to repetition in cases of multiple routes requiring the same checks (here same if statements are being checked again and again in both the routes "/health-checkup" and "/kidney-replacement" so it is a VIOLATION of DRY principle)
//therefore to solve this I will create a common function that can be accessed by all the routes - hence we will create a commom MIDDLEWARE function that can be accessed by all routes added in 3.1b


