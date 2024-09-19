const express = require("express");
const app = express();
const port = 3002;

let errorCount = 0;

// You have been given an express server which has a few endpoints.
// Your task is to
// 1. Ensure that if there is ever an exception, the end user sees a status code of 404
// 2. Maintain the errorCount variable whose value should go up every time there is an exception in any endpoint

app.get('/user', function(req, res) {
  throw new Error("User not found"); //this error triggers express to run 'error handling middleware' ~ In Express, when an unhandled error is thrown within a route handler, it triggers the error handling middleware. This means that the app.use(function(err, req, res, next) { ... }) middleware will be executed automatically to handle the error.
  res.status(200).json({ name: 'john' });
});

app.post('/user', function(req, res) {
  res.status(200).json({ msg: 'created dummy user' });
});

app.get('/errorCount', function(req, res) {
  res.status(200).json({ errorCount });
});

//error handling middleware
app.use(function(err, req, res, next){
  //console.log(err);
  res.status(400).send('error aagaya ji');
  errorCount =  errorCount + 1;
  console.log(errorCount);
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports 
