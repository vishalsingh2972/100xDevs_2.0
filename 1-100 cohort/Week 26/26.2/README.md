
# Exploring Open-Source Alternatives to Logging & Monitoring

## Problems with Newrelic

- Newrelic is expensive at scale
- They own your data
- Very hard to get data out of Newrelic

## Alternatives

- Prometheus
- Grafana
- Jaeger

---

## Prometheus

- its a time-series database.
- can monitor any numerical data.

### Understanding Architecture

<img src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/2ef9a249-6bb1-4f64-8219-a6e834dff4fe">

- It starts with the linux machine used for monitoring.

- First, the prometheus server is installed on the linux machine. After that, we need to create an endpoint in the application which will export metrics for monitoring.

- After that, Prometheus starts pulling data from the endpoint created by the (node.js or any other app) application.

- It keeps on polling on the data and stores it in a time-series database.

- If you also want your machine's stats, you can install **node-exporter** on the host machine.

- Most of the times, it is a kind of Pull based Architecture. But, if you want to push data to prometheus, you can use **push gateway** as well (though its a short-lived job).

- For Service Discovery (to know which services are running on which machine), you can use **consul**.

- In the end, you can visualize these ugly stats/metrics in the Prometheus UI.

<br>

### Drawbacks

- It gives you total/cummulative stats (not realtime). Thus, it becomes hard to get the exact stats per second.

- You cannot horizontally scale Prometheus. You can only vertically scale it (keep increasing space on the same machine).

- Single Node Process (if it goes down, you lose all the data).

To learn more about its architecture, visit [here](https://prometheus.io/docs/introduction/overview/).

<br>

### Understanding Metric Format

- **`http_requests_total{method="post",route="/user", code="200"}`** : Total HTTP requests with method `post`, to route `/user` returning status code `200`.

<br>

### PromQL

- Its a query language for Prometheus.
- **flexible query language**.

<br>

### Setting up our Express App

1. Go to `/express-app` and run `npm install` to install all the dependencies, or initialize your own express app.

<br>

2. Check the `package.json` to check the libraries installed and the script to run the app.

   <br>

   _Now, we will be writing the middleware to monitor the stats of our app._

   <br>

3. First, we check how much time does it take to complete a request. Add this middleware to the app as well:

   ```ts
   //midleware/monitor.ts

   import { Request, Response, NextFunction } from 'express';

   export const monitor = (req: Request, res: Response, next: NextFunction) => {
     const start = Date.now();
     res.on('finish', () => {
       const duration = Date.now() - start;
       console.log(`Request to ${req.path} took ${duration}ms`);
     });
     next();
   };
   ```

   <br>

4. Run the app using `npm start`, request to the one of the endpoints and check the logs.

   <img width="799" alt="Screenshot 2024-05-26 at 7 36 06 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/af6ef065-6d1d-4da5-b980-a56f52e6c19d">

<br>

### Types of Metrics in Prometheus

- **Counter** :

  - its the cummulative metric (e.g. counting number of requests)

  - **Example Metric** :
 
      <img width="491" alt="Screenshot 2024-05-26 at 7 41 06 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/d0d8a36c-a9c3-48c7-9bfd-566392d275b0">

      <details>
      <summary>Explaining Metric</summary>

    - Shows <b>554</b> requests have been made to the `/metrics` endpoint with status code `200` and method `GET`.

    - can only go **up**.

      </details>

<br>

- **Gauge** :

  - value can go up and down. can be used to measure values that fluctuate (e.g. number of users online, memory usage)

  - **Example Metric** :
 
      <img width="188" alt="Screenshot 2024-05-26 at 7 45 03 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/041e3b71-e99d-4f03-929d-b89c7a44fbdc">

      <details>
      <summary>Explaining Metric</summary>
      
      - Shows **5** users are online (concurrent requests to the server).
        
      - can go **up** and **down**.
        
      - Mostly used for websocket servers (to check number of active connections).

      </details>

<br>

- **Histogram**:

  - used to measure the distribution of values (e.g. response time of requests)

  - **Example Metric**:
 
       <img width="534" alt="Screenshot 2024-05-26 at 7 45 10 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/22b619ec-6a8c-4200-ac6e-0846b5ad98c8">

      <details>
      <summary>Explaining Metric</summary>

    - **554** people took between 0.1 to 5 ms to complete the request.

    - Its a cumulative metric. means if a request takes 10 ms, it will be counted in the 0.1 to 5 ms bucket as well as 5 to 10 ms bucket.

    - Why is it done like this? - You can look into the certain percentile of the data. For example, you can check the 95th percentile of the data.

    - File size is limited.

      </details>

<br>

### Adding Prometheus

- Install Prometheus Client using `npm install prom-client`.

<br>

**Implementing Counter**

1. First, let's implement the **`counter`** metric. Check the middleware `requestCounter.ts` to see the implementation of createing the `counter` metric.

   ```ts
   //middleware/requestCounter.ts

   ...
   import client from 'prom-client';

   // Create a counter metric
   const requestCounter = new client.Counter({
     name: 'http_requests_total',
     help: 'Total number of HTTP requests',
     labelNames: ['method', 'route', 'status_code'],
   });

   ...

   // Increment request counter
   requestCounter.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path,
    status_code: res.statusCode,
   });

   ...
   ```

2. Add this middleware to our app:

   ```ts
   // app.ts
   ...

   import { requestCounter } from './middleware/requestCounter';
   app.use(monitor);
   app.use(requestCounter);

   ...
   ```

3. To expose the metrics, we need to create a new endpoint `/metrics`:

   ```ts
   // app.ts
   import client from 'prom-client';
   ...

   app.get('/metrics', (req, res) => {
     const metrics = await client.register.metrics();
     res.set('Content-Type', client.register.contentType);
     res.end(metrics);
   });

   ...
   ```

4. Run the app and go to `localhost:3000/metrics` to see the metrics.

5. To see the metrics coming, try sending requests to the `/user` endpoint and check the `/metrics` route again.

   <img width="903" alt="Screenshot 2024-05-26 at 7 57 46 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/0b9ad926-42df-40d1-a921-47a0f30d1af9">


<br>

**Implementing Gauge**

1. Check the middleware `activeUserCounter.ts` to see the implementation of createing the `gauge` metric.

   ```ts
   //middleware/activeUserCounter.ts

   ...
   import client from 'prom-client';

   // Create a gauge metric
   const activeUserGauge = new client.Gauge({
     name: 'active_users',
     help: 'Number of active users',
     labelNames: ['method', 'route'],
   });

   ...

   // Increment active user
   activeUserGauge.inc();

   ...
   // Decrement active user
   activeUserGauge.dec();

   ...
   ```

2. Add this middleware to our app:

   ```ts
   // app.ts
   ...

   import { activeUserGauge } from './middleware/activeUserCounter';
   app.use(monitor);
   app.use(activeUserGauge);

   ...
   ```

3. Run the app and go to `localhost:3000/metrics` to see the metrics. You will see only one active connection showing.

- Try adding an artificial delay to `/user` endpoint to see the no. of active connections go up:

  ```ts
  // app.ts
  app.get('/user', async (req, res) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    res.send('User data');
  });
  ```

<br>

**Implementing Histogram**

1. Check the middleware `responseTimeHistogram.ts` to see the implementation of createing the `histogram` metric.

   ```ts
   //middleware/responseTimeHistogram.ts

   ...
   import client from 'prom-client';

   // Create a histogram metric
   const responseTimeHistogram = new client.Histogram({
     name: 'http_request_duration_ms',
     help: 'Duration of HTTP requests in seconds',
     labelNames: ['method', 'route', 'code'],
     buckets: [0.1, 5, 1, 2, 5, 100, 300, 500],
   });

   ...

   // Observe response time
   responseTimeHistogram.observe({ method: req.method, route: req.path }, duration);

   ...
   ```

   - Here, we use the concept of **Buckets**: It is used to divide the data into different ranges. For example, we have divided the data into 0.1 to 5 ms, 5 to 10 ms, 10 to 100 ms, 100 to 200 ms, 200 to 500 ms, 500 to 1000 ms, 1000 to 3000 ms, 3000 to 5000 ms.

   - The results of these buckets are **cummulative** i.e if a request takes 10 ms, it will be counted in the 0.1 to 5 ms bucket as well as 5 to 10 ms bucket.

<br>

2. Add this middleware to our app:

   ```ts
   // app.ts
   ...

   import { responseTimeDistribution } from './middleware/responseTimeHistogram';
   app.use(monitor);
   app.use(responseTimeDistribution);

   ...
   ```

3. Run the app and go to `localhost:3000/metrics` to see the metrics.

<br>

### Starting Prometheus

1. Till now, we were using the `prom-client` library to export the metrics. Now, we will be using Prometheus to scrape these metrics.

<br>

2. To use Prometheus, we need to install it. You can install it using `brew install prometheus` or using [Docker](https://prometheus.io/docs/prometheus/latest/installation/#:~:text=Using%20Docker,-All%20Prometheus%20services&text=Running%20Prometheus%20on%20Docker%20is,to%20store%20the%20actual%20metrics.).

<br>

3. Create the `prometheus.yml` file to configure Prometheus:

   ```yml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'express-app'
       static_configs:
         - targets: ['localhost:3000']
   ```

<br>

4. Run the Prometheus server using docker:

   ```bash
   docker run -p 9090:9090 -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
   ```

<br>

5. But, our express app will not be accessible by Prometheus as it is running on a different network (container). To solve this, we need to containerize to run both the express app and Prometheus on the same network.

![image](https://github.com/user-attachments/assets/243d95ba-dd96-44b6-89e5-eae24f5e9ebd)
![image](https://github.com/user-attachments/assets/1596c3fb-6d20-453a-a447-c12cf9aca68d)
<br>

6. Create a `Dockerfile` for the express app:

   ```Dockerfile
    FROM node:20

    # Create app directory
    WORKDIR /usr/src/app

    # Install app dependencies
    COPY package*.json ./

    RUN npm install

    # Bundle app source
    COPY . .

    EXPOSE 3000
    CMD [ "node", "app.js" ]
   ```

<br>

7. Create the `docker-compse.yml` file to run both the express app and Prometheus on the same network:

   ```yml
   version: '3.8'

    services:
      node-app:
        build: ./
        ports:
          - "3000:3000"
        networks:
          - monitoring

      prometheus:
        image: prom/prometheus:latest
        volumes:
          - ./:/etc/prometheus
        ports:
          - "9090:9090"
        networks:
          - monitoring

    networks:
      monitoring:
   ```

<br>

8. Also, in order to make it easy for prometheus to find our express-app on the network, we need to change the target in the `prometheus.yml` file:

   ```yml
   global:
     scrape_interval: 15s

   scrape_configs:
     - job_name: 'express-app'
       static_configs:
         - targets: ['node-app:3000'] #make this name same as the name given to the app in docker-compose file.
   ```

<br>

9. Run the docker-compose file:

   ```bash
    docker-compose up
   ```

<br>

10. Go to `localhost:9090` to see the Prometheus UI.

<br>

11. Go to **Status** tab -> **Targets** to see the available target apps connected. Notice it was able to find the `express-app:3000/metrics` from inside the container.

<br>

### <p align="center"> Congratulations 🎉 ! You have successfully implemented Prometheus in your Express App. </p>

   
<p align="center"><img width="1580" alt="Screenshot 2024-05-26 at 9 09 27 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/9226c921-d447-4b17-a2ad-f83e5b3b8a38"></p>

<br>

- Click on **Graph** tab, try executing the following query & click on the **Graph** subtab to see the metrics:

  ```promql
  http_requests_total
  ```
  
   <img width="1580" alt="Screenshot 2024-05-26 at 9 09 28 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/cd3d3ded-03f1-4371-b927-c4570459f464">

   ---

## Grafana
![image](https://github.com/user-attachments/assets/1b12cf68-7f8f-4b7d-b0a5-3c6ab869ed66)