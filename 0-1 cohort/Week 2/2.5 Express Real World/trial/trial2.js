const express = require("express");
const app = express();

function sum(n){
  let ans = 0;
  for(let i = 0; i<n; i++){
    ans = ans + i;
  }
  return ans;
}

app.get("/", function(req, res){
   const input = req.query.n; //running on http://localhost:3001/?n=30
   const Sum = sum(input);
   res.send(`Hi the sum is ${Sum.toString()}`);
})

app.get("/b", function(req, res){
  res.send("Hello"); 
})

app.get("/a", function(req, res){
  setTimeout(() => res.send("Bolo"), 4000);
})

app.listen(3001, function(){
  console.log("Started Listening");
});