// Intro to Zod ~ Zod is a popular library in Node.js that is designed for input data validation

const express = require("express");
const app = express();

const zod1 = require('zod');
const schema = zod1.array(zod1.number()); //telling zod1 that schema or structure of my input must be an array with numbers
                                      
app.use(express.json()); 

app.post("/health-checkup", function (req, res){
  //correct req input send by the user must ideally be like this ---> kidneys = [1,2] but that won't happen always hence we are using zod to handle the unwanted inputs entered by the user
  const kidneys = req.body.kidneys;

  const response = schema.safeParse(kidneys); //safeParse will validate whether 'kidneys' is in the same form as 'schema' and after everything is done the value is stored in 'response'

  //console.log(`kya hai response ? ${response.success}`);

  if(!response.success){
    console.log(response.success); //false
    res.status(411).json({
      msg : "Input entered is wrong"
    })
    //return; //can remove below else and use this instead as well
  }
  else{ 
    console.log(response.success); //true
    res.send({
      response
    })
  }
})

app.listen(7000);