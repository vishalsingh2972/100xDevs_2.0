// Input Valdiation using Global Catches
// The backend servers are hosted on the internet and are accessed by many users.
// They always look for valid input to return the response to the user. But a user can give any type of input and make the server crash.
// The error messages shown by the backend code are quite long and not every user can understand, and it is also not safe to display server information to the user on the frontend.
// To avoid error messages, input validation is needed.
// One way is to use conditionals to check the input type and content.
// But it is a long task because there might be multiple conditionals needed till the server recieves the perfect input.
// Another way is to use global catches. It is a middleware that helps in error handling.
// Global catches should be defined after all the routes so that any time an exception occurs in any route, the Global catches middleware will get called.
// Global catches takes 4 inputs. The extra input is the error message that needs to be shown to the user.

const express = require("express");
const app = express();
const port = 7000;

app.use(express.json()); //all incoming data Express won't be able to understand by default. That's because the request body is sent as a string(as HTTP requests can only send strings), and Express doesn't automatically parse JSON strings, app.use(express.json()) tells Express to use the express.json() middleware, which parses the JSON string in the request body and converts it into JSON format. This allows you to access the data in req.body as JSON now.

app.post("/health-checkup", function (req, res){
  //req input send by the user is like this ---> kidneys = [1,2]
  const kidneys = req.body.kidneys;
  const kidneyLength = kidneys.length;
  res.send(`You have ${kidneyLength} kidneys`);
})

//Global Catch Middleware ~ comes under category of error handling Middlewares in Express.js which takes 4 parameters as input
app.use(function (err, req, res, next) { //Express.js identifies this as a error handling Middleware because of these 4 arguments //"next" here as we can also have multiple error handling Middlewares one after another
  //errorCount++; //EXTRA: by using this we can kind of count the number of exceptions that we are getting in the backend, can put conditions like if number of exceptions go above 100 we can alert another system and perform certain operations as per requirement
  res.json({
    msg: "Something's wrong with the server!",
  });
});
// The above global catch was a general example. In real world, multiple checks are needed to be done for the input validation.
// This is where Zod comes into picture. It helps to check user input based on the data type.
// It checks the data type of the input that the server needs and the data type of the user input.
// Using zod makes easy for the developer to perform input validation. The tricky part here is to define the schema.

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//Also Possible, can try
async function trial1(req, res, next){
  await fetch();

  next(); //so here next will only get hit once await fetch is completed
}

//Also Possible, can try
function trial2(req, res, next){
  fetch.then(() => {
  next(); 
  })
}


/*
Here's a breakdown of the process:
- Postman: You send a JSON object in the request body, e.g., {"name":"John","age":30}.
- Serialization: The JSON object gets serialized into a string, because HTTP requests can only send strings. So, it becomes: '{"name":"John","age":30}"'.
- Transfer: The string is sent over the network to the server.
- Server: The server receives the string in the request body.
- express.json() middleware: This middleware checks and understands/identifies that the incoming data now in string format was originally in JSON format.
- Deserialization: express.json() deserializes the string back into a JavaScript object, so it becomes: { name: "John", age: 30 }.
- req.body: This JavaScript object is now accessible in the Express route handler as req.body.
The JSON data is converted to a string for transfer, and then express.json() converts it back into a JavaScript object that Express can understand and work with. 
*/