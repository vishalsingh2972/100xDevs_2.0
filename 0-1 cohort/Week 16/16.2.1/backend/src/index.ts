import express from "express";
import cookieParser from "cookie-parser"; //cookieParser middleware helps us parse a very long cookie string sent by the browser and gets you an object that you can access easily.
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken"; //JwtPayload is just the typescript type to define the payload of the value, this value is imported from "jsonwebtoken" and now stored in variable jwt.
import path from "path";
const port = 3000;

const JWT_SECRET = "test123";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}));

// dummy signin endpoint
app.post("/signin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // do db validations, fetch id of user from db
    const token = jwt.sign({
        id: 1
    }, JWT_SECRET);
    res.cookie("tokeniya", token); //will put the cookie(that has the jwt inside it) in the Set-Cookie header of the HTTP response that your server sends back to the browser. //Browser Stores Cookie: The browser receives the response and, upon seeing the Set-Cookie header, stores the cookie named "token" with the provided JWT value. The browser will then automatically send this cookie back to your server in the Cookie header of subsequent requests made to the same domain.
    res.send("Logged in!");

    // // Setting the cookie with the Secure attribute
    // res.cookie("token", token, {
    //     httpOnly: true, // Recommended for security against XSS
    //     secure: true,   // Important! Only send over HTTPS
    //     maxAge: 86400000 // Cookie expiration time (e.g., 24 hours)
    // });
});

// protected backend route
app.get("/user", (req, res) => {
    const token = req.cookies.tokeniya;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // Get email of the user from the database
    res.send({
        userId: decoded.id
    })
});

// logout route
app.post("/logout", (req, res) => {
    res.clearCookie("tokeniya"); //delete the cookie from the browser
    res.json({
        message: "Logged out!"
    })
});

// frontend getting served from express server
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/index.html")); //anytime user comes to / backend endpoint, send them the backend index.html file

//frontend being returned from our backend app/server
//ejs which was used pre react days where we kinda had our express app do basic react like stuff(basically generate dynamic HTML on the server-side)....not imp no need to learn now
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });