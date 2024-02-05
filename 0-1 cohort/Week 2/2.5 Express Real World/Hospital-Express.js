//Express and HTTP with real world examples

// Doctor Example
//In this lecture, we continued building our hospital management system using Express.js. We implemented GET, POST, PUT, and DELETE operations for handling patient information. Additionally, we used Postman to test these endpoints.
// lets create an in memory hospital
// You need to create 4 routes (4 things that the hospital can do)
// 1. GET - User can check how many kidneys they have and their health
// 2. POST - User can add a new kidney
// 3. PUT - User can replace a kidney, make it healthy
// 4. DELETE - User can remove a kidney

//1
// GET Operation
// Retrieve Kidney Information
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