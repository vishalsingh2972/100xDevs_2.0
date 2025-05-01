//Implementing Horizontal Scaling within a Single Server in Node.js project using Cluster Module
//Cluster Module: Horizontal scaling within a single server, utilizing multiple CPU cores to simulate multiple servers.
//This code example demonstrates horizontal scaling within a single server, utilizing multiple CPU cores to improve performance and responsiveness, also despite having multiple processes/cores running inside the same server, they all share the same port, making it seamless for clients to interact with the application.

import express from "express";
import cluster from "cluster"; //inbuilt in node
import os from "os"; //inbuilt in node

const totalCPUs = os.cpus().length || 4;

const port = 3000;

//when we type the command: node index.js, the process that runs through this command will be our primary process or our main primary server (user started process)
if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Primary PID:${process.pid} is running`);
  console.log('');

  // Fork workers
  //Inside the primary process, we fork other processes that start working on other cores, basically we are creating "mini servers" or "workers" running in each core inside the main primary server. For all these processes, the cluster.isPrimary will be false.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork(); //start a new worker/mini server/core //for this new worker cluster.isPrimary will be false
  }

  //If a worker dies (crashes or exits), this restarts a new worker to replace it.
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker PID:${worker.process.pid} died, Let's fork another worker!`); //try `taskkill /F /PID <PID>` in cmd to execute this
    cluster.fork();
    //process.exit(); // EXTRA ~ Would terminate the primary process, basically if one worker dies I am killing all other workers as well (via terminating the initial Node.js process that you started with node index.js)
  });
} else { //This block runs in each worker process (not in the primary or main primary server).
  const app = express();
  console.log(`Worker PID:${process.pid} started`);

  app.get("/", (req, res) => {
    res.send(`Hello World from mini server / worker with PID:${process.pid}.`);
  });

  //This route will calculate the sum of all numbers from 0 to n, where max value of n is 5000000000.
  app.get("/api/:n", function (req, res) {
    let n = parseInt(req.params.n);
    let count = 0;

    if (n > 5000000000) n = 5000000000;

    for (let i = 0; i <= n; i++) {
      count += i;
    }

    res.send(`Final count is ${count} with PID:${process.pid}`);
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}