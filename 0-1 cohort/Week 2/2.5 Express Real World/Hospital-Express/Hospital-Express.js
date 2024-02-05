//Express and HTTP with real world examples

// Doctor Example
//In this lecture, we are building a hospital management system or an in memory hospital(i.e without using a database) using Express.js. 
// We implemented GET, POST, PUT, and DELETE operations for handling patient information. Additionally, we used Postman to test these endpoints.
// We created 4 routes (4 things that the hospital can do)
// 1. GET - Going for a consultation to get check up, User can check how many kidneys they have and their health
// 2. POST - Going to get a new kidney inserted, User can add a new kidney
// 3. PUT - Going to get a kidney replaced, User can replace a kidney, make it healthy
// 4. DELETE - Going to get a kidney removed, User can remove a kidney

// Status codes (using Doctor Logic)
// 1. 200 - Everything went fine
// 2. 404 - Doctor is not in the hospital
// 3. 500 - Mid surgery light went away
// 4. 411 - Inputs were incorrect, wrong person came to surgery
// 5. 403 - You were not allowed or denied access to the hospital

const express = require("express");
const app = express();
const port = 3000;

// Sample data
var users = [
  {
    name: "Ramukaka",
    kidneys: [
      {
        healthy: false,
      },
    ],
  },
];

//1
//GET Operation
//Retrieve Kidney Information
app.get("/", function (req, res) {
  const Ramukakkidneys = users[0].kidneys;
  const nummberOfKidneys = Ramukakkidneys.length;
  let numberOfHealthyKidneys = 0;

  for (let i = 0; i < Ramukakkidneys.length; i++) {
    if (Ramukakkidneys[i].healthy) {
      numberOfHealthyKidneys += 1;
    }
  }
  const numberOfUnHealthyKidneys = nummberOfKidneys - numberOfHealthyKidneys;

  res.json({
    nummberOfKidneys,
    numberOfHealthyKidneys,
    numberOfUnHealthyKidneys,
  });
});

//2
//POST operation
//Add Kidney Information
app.post("/", function (req, res) {
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy,
  });
  res.json({
    msg: "DONE!",
  });
});

//3
//PUT operation
//Update All Kidneys to Healthy
app.put("/", function (req, res) {
  for (let i = 0; i < users[0].kidneys.length; i++) {
    users[0].kidneys[i].healthy = true;
  }
  res.json({});
});

//4
//DELETE operation
//Update All Kidneys to Healthy
app.delete("/", function (req, res) {
  if (isThereAtleastOneUnhealthyKidney()) {
    const newKidneys = [];
    for (let i = 0; i < users[0].kidneys.length; i++) {
      if (users[0].kidneys[i].healthy) {
        newKidneys.push({
          healthy: true,
        });
      }
    }
    users[0].kidneys = newKidneys;
    res.json({ msg: "done!" });
  } else {
    res.status(411).json({
      msg: "NO BAD KIDNEYS!!",
    });
  }
});

// Helper function for DELETE operation
function isThereAtleastOneUnhealthyKidney() {
  let atleastoneUnhealthyKidney = false;
  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      atleastoneUnhealthyKidney = true;
    }
  }
  return atleastoneUnhealthyKidney;
}

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});