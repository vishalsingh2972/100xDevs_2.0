// 3.2 Databases and Authentication

// - fetchAPI
//- Authenication
  //--Hashing
  //--Encryption
  //--JSON Wen Tokens
  //--Local Storage

//Assignment 1
//A website which has 2 endpoints:

//endpoint 1
/*
POST /signin 
Body - { 
username: string 
password: string 
} 
Returns a json web token with username encrypted
*/

//endpoint 2
/*
GET /users 
Headers - 
Authorization header 
Returns an array of all users if user is signed in (token is correct) 
Returns 403 status code if not
*/
