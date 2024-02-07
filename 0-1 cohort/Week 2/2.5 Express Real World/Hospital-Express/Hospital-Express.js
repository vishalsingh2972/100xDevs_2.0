//Express and HTTP with real world examples

// Doctor Example
//In this lecture, we are building a hospital management system or an in memory hospital(i.e without using a database) using Express.js. 
// We implemented GET, POST, PUT, and DELETE operations for handling patient information. Additionally, we used Postman to test these endpoints.
// We created 4 routes (4 things that the hospital can do)
// 1. GET - Going for a consultation to get check up, User can check how many kidneys they have and their health
// 2. POST - Going to get a new kidney inserted, User can add a new kidney
// 3. PUT - Going to get a kidney replaced, User can replace a kidney, make it healthy
// 4. DELETE - Going to get a kidney removed, User can remove a kidney, remove unhealthy kidenys

// Status codes (using Doctor Logic)
// 1. 200 - Everything went fine
// 2. 404 - Doctor is not in the hospital
// 3. 500 - Mid surgery light went away
// 4. 411 - Inputs were incorrect, wrong person came to surgery
// 5. 403 - You were not allowed or denied access to the hospital

const express = require("express");
const app = express();
const port = 4000;

//Sample data - users details
const users = [{
    name: "John",
    kidneys: [{
        healthy: false,
    },
    {
        healthy: true,
    }]
}];

app.use(express.json());

//1
//GET Operation
//Retrieve Kidney Information
app.get("/",function(req,res){
  const johnKidneys = users[0].kidneys;
  const numberOfKidneys = johnKidneys.length;
  let numberOfHealthyKidneys = 0;
  for(let i = 0; i<numberOfKidneys; i++){
    if(johnKidneys[i].healthy == true){
      numberOfHealthyKidneys += 1;
    }
  }
  const numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;
  res.json({
    numberOfKidneys,
    numberOfHealthyKidneys,
    numberOfUnhealthyKidneys
  })
})

//2
//POST operation
//Add Kidney Information
app.post("/",function(req,res){
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy
  })
  console.log(users[0].kidneys);
  res.json({
    msg: "Done Mubarak ho"
  })
})

//3
//PUT operation
//Update All Kidneys to Healthy
app.put("/",function(req,res){
  if(isThereAtleastOneUnhealthyKidney()){
    for(let i = 0; i<users[0].kidneys.length; i++){
      users[0].kidneys[i].healthy = true;
    }
    res.json({}) //If the request succeeds without errors, sending a JSON response although empty is essential to signal completion to the client (i.e Postman). An empty response might leave Postman hanging and loading continously.
  }
  else{
    res.status(411).json({
      msg: "Bhai, all kidneys already healthy sab Badiya ❤",
    })
  }
})

//4
//DELETE operation
//Remove a unhealthy Kidney
app.delete("/",function(req,res){
  if(isThereAtleastOneUnhealthyKidney()){
    const newKidneys = [];
    for(let i = 0; i < users[0].kidneys.length; i++){ 
      if(users[0].kidneys[i].healthy){
        newKidneys.push({
        healthy: true,
        })
      }
    }
    users[0].kidneys = newKidneys;
    res.json({})
  }
  else{
    res.status(411).json({
      msg: "Bhai, nothing to remove sab Badiya ❤",
    })
  }
})

//Helper function for DELETE operation //one of the edge cases for DELETE here
//can also use as Helper function for PUT operation //one of the edge cases for PUT here
function isThereAtleastOneUnhealthyKidney(){
  let atleastOneUnhealthyKidney = false; //initially false i.e no unhealthy kidneys exist
  for(let i = 0; i < users[0].kidneys.length; i++){
    if(!users[0].kidneys[i].healthy){
      atleastOneUnhealthyKidney = true;
    }
  }
  return atleastOneUnhealthyKidney;
}

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
})