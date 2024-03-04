// 𝘀𝗶𝗺𝗽𝗹𝗲 𝗛𝗧𝗧𝗣 𝘀𝗲𝗿𝘃𝗲𝗿 𝘂𝘀𝗶𝗻𝗴 𝗡𝗼𝗱𝗲.𝗷𝘀 𝗮𝗻𝗱 𝗘𝘅𝗽𝗿𝗲𝘀𝘀!

//import express from internet and makes the Express features available for use in your project in your local machine
//First npm install express in CL
//Next
const express = require("express");
const bodyParser = require("body-parser"); //for getting access to body of the incoming request: req.body; //for express to get a JSON body of the POST/GET request we have to use the "body-parser" library
const app = express(); //initialises an instance of express
const port = 3000;
//const port = process.env.PORT || 3000; //export port=3006

app.use(bodyParser.json()); //or can also write app.use(express.json()); //middlewares topic 
app.get('/', function(req, res){
  //console.log(req.body);

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
  
  //res.send('<b>Hello Bittu!</b>')

  // setTimeout(() => {
  //   res.status(401).send('Hello Bittu with status!')
  // },5000)
})

app.post('/conversations', (req, res) => {
  //res.send('<b>Hello Bittu!</b>')

  //console.log(req.headers);
  console.log(req.headers["authorization"]);
  console.log(req.body); 
  res.send({
    msg: "2 + 2 = 4"
  })
})

//chatGPT example - 2:11:37
app.post('/backend-api/conversation', (req, res) => {
  const message = req.body; //body of the input data send by user from frontend
  const message2 = req.body.message; //text in the "message" attribute in the body of the input data send by user from frontend
  //const message3 = req.query.message;

  // run the ML algo thingy with the input or req/request from user,solve the question asked get the output and return it back as res/response
  console.log(message2);
  //console.log(message3);
  res.json({
    output: "the answer to your question is so and so...."
  })
})


app.listen(port, function(){
  console.log(`Example app listening on port ${port}, so now go to localhost:${port} and check`); //will appear in CL
})





