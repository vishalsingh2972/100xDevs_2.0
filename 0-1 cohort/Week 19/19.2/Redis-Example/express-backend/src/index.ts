//This is the primary backend code that I am using to send data to the Redis queue

import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

app.post("/submit", async (req, res) => {
  const problemId = req.body.problemId;
  const code = req.body.code;
  const language = req.body.language;
  console.log(req)

  try {
    await client.lPush("problems_queue", JSON.stringify({ code, language, problemId }));
    // Store in the database
    res.status(200).send("Submission received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to store submission.");
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startServer();