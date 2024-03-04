//Zod for validating email, password, country entered by the user.

const express = require("express");
const app = express();

const zod2 = require('zod');

//Zod schema for validating email, password, and country
const schema = zod2.object({
  email : zod2.string().email(),         //email with @ .com format //z.string().email(); inbuilt given by Zod
  password : zod2.string().min(8), //password with atleast 8 letters 
  country: zod2.literal('IN').or(zod2.literal('US'))
})

app.use(express.json()); 

app.post("/login", function (req, res){
// { expected input format from the user must ideally be like this: 
//   email : string => email @ .com
//   password : atleast 8 letters 
//   country : "IN" or "US"
// } 
//but that won't happen always hence we are using zod to handle the unwanted inputs entered by the user

  const userInput = req.body;
  const response = schema.safeParse(userInput); //safeParse will validate whether 'userInput' is in the same form as 'schema' and after everything is done the value is stored in 'response'
  //console.log(userInput); console.log(response);  console.log(response.data); console.log(response.data.email); console.log(response.error.issues);
  
  // If user sends wrong input and validation fails, send an error response
  if(!response.success){
    res.status(411).json({
      //response
      success: false, 
      failureDetails: response.error.errors //or can also put failureDetails: response.error.issues, will give same response
    })
    return;
  }
  // If user sends correct input and validation passes, process the user data
  const { email, password, country } = response.data; 
  //console.log(email);
  res.send({
    //response
    success: true, 
    message: 'User registered successfully', 
    userDetails: { email, password, country }
  })
})

app.listen(7001);




//Zod trial using function and giving an input manually
//trial1
// const z = require('zod');
// const schema = z.object({
//     email : z.string().email(),
//       password : z.string().min(8)
//   });

// const response = schema.safeParse({
//                                      email : "vishal@bittu.cm",
//                                      password : "12345678"
//                                    });
// console.log(response);


//trial2
// const zo = require('zod');
// function validate(obj){
//   const schema = zo.object({
//     email : zo.string().email(),
//     password : zo.string().min(8)
//   });

// const response = schema.safeParse(obj);
// console.log(response);
// }

// validate({
//   email : "vishal@bittu.cm",
//   password : "12345678"
//         });