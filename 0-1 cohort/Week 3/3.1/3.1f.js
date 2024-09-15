// Authentication

// As you can tell by now, anyone can send requests to your backend 
// They can just go to postman and send a request 
// How do you ensure that this user has access to a certain resource
// Dumb way - Ask user to send username and password in all requests as headers

// Slightly better way - 
// 1. Give the user back a token on signup/signin 
// 2. Ask the user to send back the token in all future requests 
// 3. When the user logs out, ask the user to forget the token (or revoke it from the backend)

//Why send token stored in local storage each time to the backend, why not just store username/password in local storage and send each time to the backend? ~ in short, to avoid security risks

// Library to get comfortable with - [jsonwebtokens](https://jwt.io)

// JSON Web Tokens(JWT) is a library:
// - Commonly used for creating tokens that can be **securely transmitted between parties**.
// - These tokens contain claims that **can be verified and trusted**, making them a **robust choice for implementing authentication** mechanisms in web applications.