//This is my Redis pub-sub's code that I am using to recieve data from the worker's
//This Redis pub-sub is also in the same container as my Redis queue

import { createClient } from "redis";

const client = createClient();

async function startSubscriber() {
  try {
    await client.connect();
    console.log("Subscriber connected to Redis.");

    await client.subscribe("problem_done_pub_sub", (message) => {
      console.log(`Received message from problem_done_pub_sub: ${message}`);
      const data = JSON.parse(message);
      console.log(`Problem ID: ${data.problemId}, Status: ${data.status}`);
    });

    console.log("Subscriber listening for messages...");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startSubscriber();