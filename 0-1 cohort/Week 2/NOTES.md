## NodeJS Runtime
- What is ECMAScript?
    - It is a scripting language specification standardized by ECMA International for JS.
    - It is a scripting language specification on which JS is based.
    - Make sure if you are making a compiler you incorporate hte ECMAScript.
    - You make changes when new ECMAScript version comes so that your compiler too support the new specification.
- NodeJS is a Runtime not a language, something which can run JS, compiles JS and provide bunch of other things.
- Written in C/ C++

## Bun
- Competitor of <b text-color='#000'>NodeJS</b>, we will do everything Node do in better way.
- It is written in Zig 
- It is very fast compared to Node
- It is a high probability that people will switch to bun in future.
- It is backward compatible, code written for node will work on bun too.

## Writing Backend applications using JS
- 1. Clis (Command Line Interface(s))
- 2. Create a video player
- 3. Create a game
- 4. Create a <b>HTTP Server</b>

## What is an HTTP Server?
- A Protocol that is defined for machines to communicate
- Specifically for websites, it is the most common way for your website's frontend to talk to its backend.
- WebRTC is also a protocol which is used for audio/ video communication.
- Most of the websites (90-95%) in the world uses HTTP protocol to run

## What is an HTTP Server?
- Some code that follows the HTTP Protocol and is able to communicate with clients (browsers/ mobile apps...)
- Sometimes HTTP Server Call is also called Remote Procedural Calls (RPC).
- HTTP Server does something similar to that what function do but via Internet Protocol on different machine (generally).
- Things client need to worry about:
    - Protocol (HTTP/ HTTPS)
    - Address (URL/ IP/ PORT)
    - Route
    - Headers, Body, Query Params
    - Method
- Things server needs to worry about
    - Response Headers (Often used when you are logging in as you receive cookie in return and browser need to store it)
    - Response Body
    - Status Codes
- If we have body then why do we need headers and status code in response?
    - The makers of HTTP Server they wanted Separation of concerns so they created it this way though they could have sended all the info in body.
- JS APIs are different from HTTP APIs.

## What is DNS Lookup?
- Converting the readable domain name in corresponding domain ip.

## Writing your own server in Node.js using Express
- Hello World Program in Express
```
const express = require("express");
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) // Even if you don't send the other callback function it is fine.
```

- Assignment: 
    - create a todo app that lets users store todos on the server
    - try to create a http server from scratch in c
    - Create an http server in rust using actix-web
    - create an http an http server in golang using the gurrila framework
    - spring boot java
- You will notice that in the end the protocol remains the same. In Java and Golang you will see your thread is blocked off sometimes, like when you doing DB call.
- Express uses http module which is written in C/C++ to create a http server.
- Javascript is single threaded, so NodeJS will process one request at a time. Like in below example the thread will be stuck at the loop and the other requests will not be handled by the server anymore.
```
app.get('/', (req, res) => {
    let a = 0;
    console.log('Request has been reached!');
    for(let i = 0; i<10000000; i++>){
        a+=1;
    }
    res.send('Hello World!');
})
```
- req.headers have all the headers send from browser
- /rote or /route/ leads to same route
- Private vs Public IP. You can access your server in the private network you have using the private IP of the machine in which your server is running.
- When you will try to access the body send using the POST method, express doesn't do the parsing of the body so you will get undefined. So, you require something called body parser.
- npm install body-parser
```
const express = require("express");
const bodyParser = require("body-parser");
const app = express()
const port = 3000
// middleware
app.use(bodyParser.json()); // This guy will extract JSON from the body which is send and put it into the req.body
app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Post Request Received!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```
- Use `npx nodemon index.js` for automatically restarting the server on every change.

```
const express = require("express");
const bodyParser = require("body-parser");
const app = express()x
const port = process.env.PORT || 3000

// middleware
app.use(express.json()); // This guy will extract JSON from the body which is send and put it into the req.body

app.post('/backend-api/conversation', (req, res) => {
    console.log(req.body);
    res.send('Post Request Received!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```
- We can use body-parser, the body-parser module enables us to parse incoming request bodies in middleware. Express.js server needs to know which type of data you're sending over the network, so it know how to parse.

- What is process.env.PORT?
  - It is a way to access an environment variable.
  - Environment variables are independent of programming language.
  - setup an environment variable: export PORT=3005
  -  port is a virtual point of communication with the server
