## Today's Topics

- Cluster Module and Horizontal Scaling
- Capacity Estimation and Vertical Scaling

---

## Single Threaded vs Multi-Threaded

- Single-threaded only uses one core of the CPU
- Can't handle parallel tasks
- If we try to run different node.js processes, we encounter port conflicts.
- Eg: Node.js, Python, Ruby etc.

**Q. If JS in single-threaded, how does it handle asynchronous tasks?**
**Ans**. It uses the event loop to handle asynchronous tasks. When multiple async tasks come one by one, JS puts the web api calls to a seperate stack (thread) and by the time the response comes, it keeps working on next tasks. When the response comes, it puts the callback in the callback queue and the event loop keeps checking the callback queue and executes the callback when the stack is empty.

- Multi-threaded can use multiple cores of the CPU
- Can parallelize tasks into multiple threads to be run on multiple cores
- But, paralelization doesn't happen automatically by the language. It has to be implemented by the developer.
  
  <br>
  
  <img width="741" alt="Screenshot 2024-04-27 at 7 19 14 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/ac5618a8-5691-415a-9c9d-8c4ba5dfcce7">

- For eg: If we want to calculate the sum upto 10000, we divide the job into 10 parts to be run on 10 threads. Each thread calculates the sum till 1000 numbers and then the main thread adds the sum of all the threads.
- Eg: Java, GoLang, Rust etc.

---

## Practical Example of Single Threaded vs Multi-Threaded

- Run a simple program in Node.js to run an infinite loop.
  ```js
  while (true) {
    console.log('Hello');
  }
  ```
  <img width="426" alt="Screenshot 2024-04-27 at 8 08 02 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/1dc67ba9-9532-4c69-abb0-29a910ec6941">

  
- Check the CPU usage in the Task Manager or by running following command in terminal:

  ```bash
  top
  ```
  
  <img width="517" alt="Screenshot 2024-04-27 at 7 25 22 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/c340820b-f38d-4123-acec-377f7b1e203a">
  
  You will notice one of the cores of the CPU is being used 100% by the Node.js process.

<br>

**Q. How does multi-threaded help in these situations?**

- Help us utilize multiple cores of the CPU
- Lets us interact multiple threads with one another.

- Now, try running the same program in Rust:

  ```rust
  use std::thread;

  fn main() {
      // Spawn three threads
      for _ in 0..3 {
          thread::spawn(|| {
              let mut counter: f64 = 0.00;
              loop {
                  counter += 0.001;
              }
          });
      }

      loop {
          // Main thread does nothing but keep the program alive
      }
  }
  ```

- To run the above program, you need to install Rust and Cargo. You can install it from [here](https://www.rust-lang.org/tools/install). Then run the following command:

  ```bash
  cargo run
  ```

- You will notice that the CPU usage is not 100% for a single core but around 25% spreaded across multiple cores.

<br>

**Quick Fact**: We can also utilize multiple cores in Node.js using:

1. the `cluster` module.
2. spawning other processes.

---

## Why do we need Scaling?

- To handle the load and traffic of the application
- Helps us increase the memory/size (CPUs) of the server or number of servers themselves.

---

## Vertical Scaling

<img width="600" alt="Screenshot 2024-04-27 at 7 11 18 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/c6afa1e3-a661-47a3-b95b-1e32e87103ce">

- Increasing the memory and CPU of the server
- It has a limit and can be expensive
- Node.js is single-threaded, so it can't utilize multiple cores
- Thus, vertical scaling is not very effective for Node.js

---

## Horizontal Scaling

- Increasing the number of servers
- Can handle more traffic and load
- Can be done using:
  1. Load Balancers
  2. Auto Scaling Groups (ASGs)

### Implementing Horizontal Scaling in Node.js project

**Ugly Way**:
Run multiple node.js processes on terminal.

**Issues**:

- Port conflicts
- Keep track of all the processes

**Better Way**: Using the `cluster` module.

1. Go to the `/programs/express-app` directory.
2. Check the following code to see the working of the `cluster` module.
3. In the code, we try to start the primary server.
4. Inside the primary server, we check if the server is the master or worker.
5. If it is the master, we fork the workers.
6. If it is the worker, we start an express server. Here, we will not have port conflicts as each worker will have a different port.
7. Try running the code using the following command:

   ```bash
   node index.js
   ```

8. Notice different workers getting initialized with running on different cores with unique process ids.

---

## Capacity Estimation

- Helps us estimate the capacity of the server required to handle the load.
- Helps us decide whether to go for vertical or horizontal scaling.

**Common System Design Questions**:

1. How would you scale your application?
2. How do you handle spikes?
3. How can you support a certain SLA(Service Level Agreement) given some traffic?

**Ans**: We can do some scenario based calculations:

1. If we have 1M users, 1 user sends 10 req/sec, then we need to handle 10M req/sec.

   - Estimate the Reqs/sec to be handled by one server:
     - If one server can handle 100 req/sec, then we need 100 servers.

  <br>

2. To handle spikes:

   - Assuming we have monitoring enabled.
   - We can set ASGs with conditions like:
     
     <img width="400" alt="Screenshot 2024-04-27 at 8 31 11 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/607b029f-6aa2-4d70-98c6-7e04dab64145">
     
     - If CPU usage is more than 70%, then add 10 more servers.
     - If CPU usage is less than 30%, then remove 10 servers.
   - We can also have a buffer of 20% extra servers to handle spikes.

  <br>

3. For Realtime applications:

   - Now, we don't have requests per seconds, but we have persistent connections which is expensive.
   - Here the metric is not the no. of requests, its the number of connections.
   - Some complexities to handle:
     - If server needs to scale up, it needs to handle the existing connections: probably through some client-side logic to end and reconnect the connection.
     - If server needs to scale down, needs to handle existing connections: probably through some logic to transfer the connections to another server.

  <br>

4. For CPU Intensive tasks like:

     <img width="500" alt="Screenshot 2024-04-27 at 8 37 04 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/cf55ae2f-d9b4-4180-95be-6e8dc6541a9b">
     
   - Youtube: Here the transcoding is CPU intensive.
   - Replit: Here the code execution is CPU intensive.

     <br>
     
     <img width="400" alt="Screenshot 2024-04-27 at 8 46 10 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/20ea2dfb-62c3-4617-94b1-d3e0404aae8d">
     
   - Live Streaming of matches. Here sending different video quality versions to million of users is the tough part. Eg: Hotstar.

   - Here, we have some options to scale up:
     - Using ASGs to add more servers when the queue of tasks starts increasing a certain limit.
       - even Hotstar uses it.
         **Downsides**:
       - not a good option for replit
      
       <br>
      
       <img width="600" alt="Screenshot 2024-04-27 at 8 41 22 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/dff84768-e05c-4293-ab22-30d0fb3e205d">
       
     - Keeping a certain size of **warm pool** ready for connection.
       
       **Downsides**:
       - we are restricting the cpu usage to a certain limit.
       - good option for replit.