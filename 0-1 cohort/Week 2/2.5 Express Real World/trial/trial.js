// The code effectively demonstrates how to use Express.js to create a simple web server that performs calculations and returns responses based on user input.
// here we use (app.get for GET requests) and query parameters (req.query.number) for handling incoming requests and extracting data.
// The res.send method is used to send a response back to the client.

//When we send a number in the form of a get request to http://localhost:3000/?number=30, it solves and returns the sum from 0 to number as response back to the frontend

const express = require("express");
const port = 3000;

function calculateSum(n){
  let ans = 0;
  for(let i = 0; i<n; i++){
    ans = ans + i;
  }
  return ans;
}

const app = express();

app.get("/", function(req, res){
  const input = req.query.number; //running on http://localhost:3000/?number=30
  const reply = calculateSum(input);
  res.send(reply.toString()); //whenever your sending back a response convert it to a string, as sending only "reply" as response will cause issue as it might misinterpret the number value of "reply" with a status code
})


app.listen(port, function(){
  console.log(`Example app listening on port ${port}, so now go to localhost:${port} and check`);
})
