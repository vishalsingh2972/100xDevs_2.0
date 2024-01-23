// simple HTTP server using Node.js and Express!

//import express from internet and makes the Express features available for use in your project in your local machine
//First npm install express in CL
//Next
const express = require("express");
const app = express(); //initialises an instance of express
const port = 3000;

app.get('/', function(req, res){

  // let a = 1;
  // console.log('request reached start');
  // for(let i = 0; i<4000000000000000; i++){
  //   a = a + 0;
  // }
  // console.log('request finish end');

  res.send('Hello Bittu!') //whenever someone will try to hit my backend server control will reach here
                           //what this basically does is whenever someone is trying to get something from the server and they reach '/' this location/address, we run the function and return ('Hello Bittu!')
                           //will appear in frontend localhost:${port}

  // res.json({
  //   name: "Vishal",
  //   age: 22
  // })
})

app.listen(port, function(){
  console.log(`Example app listening on port ${port}, so now go to localhost:${port} and check`); //will appear in CL
})
