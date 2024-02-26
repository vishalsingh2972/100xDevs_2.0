//Assignment 1
//A website which has 2 endpoints:

//endpoint 1 - POST /signin which takes username and password as input from FE and Returns a json web token (JWT) with username encrypted
//endpoint 2 - GET /users which takes Authorization header or previosly returned JWT as input from FE and returns an array of all users if user is signed in (token is correct) or returns 403 status code if not