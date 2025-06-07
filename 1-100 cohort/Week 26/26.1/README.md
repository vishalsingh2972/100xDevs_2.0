# Logging, Monitoring and Newrelic

## Logging

- the process of recording events that happen when some software runs.
- the events may consist of:
  - error messages
  - warning messages
  - information messages
  - debug messages

---

## Monitoring

- the process of observing the state of a system.
- it is used to check the status of the system and to identify issues with the system.
- issues may include:
  - slow response time
  - high CPU usage
  - memory leaks
  - disk space issues
  - network issues

---

## Alerts

- alerts are notifications that are sent when a system is not functioning properly.
- here, line of defence goes like:
  - On Call person -> Team Lead -> Manager -> Director -> CEO

---

## Setting up Newrelic for Host Monitoring

1. Go to [Newrelic](https://newrelic.com/) and create an account.

2. We are going to monitor a test linux machine on AWS. For that, we need a test instance. Follow the past steps to create a simple amazon linux machine on AWS and connect to it.
   <img width="1214" alt="Screenshot 2024-05-25 at 7 31 25 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/cdc9cef6-311a-43cd-a82e-89ce14b8cade">

3. Go the Newrelic machine installation page and select the linux option.
   <img width="1226" alt="Screenshot 2024-05-25 at 7 23 13 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/06f30509-12ab-4872-9af4-e0fb14ba8b74">

4. Create a new key.
   <img width="1225" alt="Screenshot 2024-05-25 at 7 23 36 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/6885d0b0-5a23-43eb-9368-b0810c2e00eb">

5. Next, copy the command to install the **newrelic-infra** agent and paste it in the terminal of the test machine. Press `Y` for each prompt asked during the installation.

<br>

### <p align="center">Congratulations 🎉🎉 ! Newrelic agent is installed on the test machine and can be monitored from the Newrelic dashboard.</p>
<p align="center"><img width="1214" alt="Screenshot 2024-05-25 at 7 31 21 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3ad567c5-f2a4-4256-857c-401f9dbd96b1"></p>
<p align="center"><img width="1214" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/52859874-c5cf-4a40-8bc0-6f07f962b301"></p>

---

## Setting up Node.js for monitoring

1. Follow the instructions to install Node [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html).

2. Create a simple node.js file using `vi index.js` and write an infinite loop in it.

   ```js
   while (true) {
     console.log('Hello World');
   }
   ```

3. Run the file using the command `node index.js`.

4. Notice in the dashboard of newrelic that **CPU Usage %** spikes up. Keep adding random number to an array also, to see the **Memory Usage %** spike up as well.
  
    <img width="1214" alt="Screenshot 2024-05-25 at 7 31 23 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/98a02d61-ed64-4174-ab5e-e8d8918570bd">

<br>


### Interacting with the Dashboard

1. Click on the three dots on the top right corner of any chart to see the options available for that chart.

2. Click on `View Query` to see the query that is being run to generate the chart. You can customize the query as per your needs (like changing the time range) and save it.
    <img width="751" alt="Screenshot 2024-05-25 at 7 41 10 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/9262d4a7-0415-49e3-8bd9-a8895b5e71eb">

---

## Setting up Custom Dashboard

1. Go to the **Dashboard** tab and click on **Create your first Dashboard**.
   <img width="1445" alt="Screenshot 2024-05-25 at 7 42 25 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/f1320ab0-541d-4c51-8138-7e64f8743b91">

2. Write your dashboard's name and click on **Create**.

3. Click on **Add a new Chart** -> **Add a chart** and write the query for your use case.

4. Alternatively, you can click on _three dots_ on top right of existing charts in the dashboard and click on **Add to Dashboard** to add them to your custom dashboard.
    <img width="751" alt="Screenshot 2024-05-25 at 7 41 10 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/e40013f2-b988-4df4-a275-3b18556c3d81">

---

## Creating Alerts

1. Click on the _three dots_ on the top right corner of any chart and click on **Create Alert**.

2. Keep or change the query according to your needs to create the alert on which you want to be notified -> Click Next.

3. In the **Set Threshold** section, scroll down to see all the options available to set the threshold for the alert. You can set the threshold for **CPU Usage %**, **Memory Usage %**, **Disk Usage %**, etc. Then click on **Next**.

4. Next, add details like **Name**, **Policy** etc. and click on **Save Condition**.

5. Now, you will be notified whenever the threshold is crossed.

6. Go to the **Alerts** tab -> **Alerts Tab Condtions** to see all the alerts that have been created till now by the system and you.

7. To change the workflow (like who should be notified first, second, etc.), go to **Alerts** -> **Workflows**. Click on the **Policy** you want to change or create a new one.

    <img width="1446" alt="Screenshot 2024-05-25 at 11 58 10 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/5e37f301-1eec-438a-8469-fca39d61a9f6">
    <img width="1436" alt="Screenshot 2024-05-25 at 11 59 17 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/8f67758d-575a-45c0-b100-2f118855b6ca">

---

## NRQL Quick Review

- NRQL stands for New Relic Query Language.
- It is used to query the data in New Relic.
- lets you do complex things like:
  - data analysis tasks
  - create custom dashboards
  - alerts

<br>

**Some NRQL queries:** Go to the **Query your data** tab and write the following queries:

- To get the CPU usage:

  ```sql
  SELECT average(cpuPercent) FROM SystemSample SINCE 1 hour ago
  ```

- Filter by High CPU Usage

  ```sql
  SELECT average(cpuPercent) FROM SystemSample WHERE cpuPercent > 90 SINCE 1 hour ago
  ```

- Multiple Graphs in same time

  ```sql
  SELECT average(transmitBytesPerSecond) AS `Transmit bytes per second`, average(receiveBytesPerSecond) AS `Receive bytes per second` FROM NetworkSample WHERE (entityGuid = 'NDQ2MDY2NXxJTkZSQXxOQXwtMzE2MTI3OTkyNzM3NDEzMTE1Mw') TIMESERIES AUTO
  ```

- Facets (Group by)

  ```sql
  SELECT average(cpuPercent) FROM SystemSample FACET hostname SINCE 1 hour ago
  ```

- More advanced queries [here](https://projects.100xdevs.com/tracks/monitoring-1/Monitoring--Logging-and-Newrelic-7).

---

## APM (Application Performance Monitoring)

- till now, we were monitoring our full host. Now, we need to monitor a single application/service.
- helps you monitor the performance of your **application**.

### Setting up Logging

1. Click on `Add Data` Tab -> Search for `Node.js`.
   
2. Under `Application Monitoring` -> Click on **Node.js**.

   <img width="1210" alt="Screenshot 2024-05-25 at 8 13 13 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/59dbafbd-ec2d-47e4-940a-42dda5dc0742">

   <br>

3. There are multiple ways to monitor our application. In our case, we will directly manually install it on the host. Click on `On a host` option -> `Create a New key`.

4. Before following the instructions -> Create a simple express app using following commands:

   ```bash
   mkdir myapp
   cd myapp
   npm init -y
   npm install express
   ```

5. Follow the instructions provided and setup configuring the newrelic agent.

   - Install `Newrelic`:

   ```bash
   npm install newrelic --save
   ```

   - Next, add the following line at the top of your `package.json` file:

     ```json
       "scripts": {
         "start": "NEW_RELIC_APP_NAME=node-app NEW_RELIC_LICENSE_KEY=license_key node -r newrelic index.js"
       },
     ```

   - Create a simple express app:

     ```js
     require('newrelic');

     const express = require('express');

     const app = express();

     app.get('/', (req, res) => {
       console.log('route hit');
       res.json({ message: 'hi there' });
     });

     app.listen(3000, () => {
       console.log('listening on port 3000');
     });
     ```

6. After following the instructions, run your app -> go to your newrelic page -> click on **Continue**.

7. To provide some load on the server, connect through a new terminal -> run the following command to install the following library and run it:

   ```bash
    npm i -g loadtest
    loadtest -c 10 --rps 200 http://localhost:3000/
   ```

     <img width="1023" alt="Screenshot 2024-05-25 at 8 32 31 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/854d90df-91a7-47ec-8511-12ad5ef08c11">
     <img width="1023" alt="asfasasgasg" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/249197f3-fa56-4de0-94a9-936a547a05be">


8. In the newrelic page, your **See your data** tab will show the data of your application.

   <img width="1222" alt="Screenshot 2024-05-25 at 8 31 03 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/021b4b63-646f-4bb1-b640-a5689bb46351">

9. You will still see the logs section still empty. Next, we will be setting up logger.

## Setting up Logger

1. We use the [winston](https://www.npmjs.com/package/winston) library to log the data as it has a bunch of benefits (like logging to multiple files, logging to multiple locations, etc.).

2. Update the `package.json` file to enable the key `NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED`:

   ```json
   "scripts": {
     "start": "NEW_RELIC_APPLICATION_LOGGING_FORWARDING_ENABLED=true NEW_RELIC_APP_NAME=node-app NEW_RELIC_LICENSE_KEY=license_key node -r newrelic index.js"
   },
   ```

3. Install the `winston` library:

   ```bash
   npm install winston
   ```

4. Update the code to include the `winston` library:

   ```js
   require('newrelic');
   const winston = require('winston');
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     defaultMeta: { service: 'user-service' },
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' }),
     ],
   });

   if (process.env.NODE_ENV !== 'production') {
     logger.add(
       new winston.transports.Console({
         format: winston.format.simple(),
       })
     );
   }

   const express = require('express');
   const app = express();

   app.get('/', (req, res) => {
     logger.info('route hit');
     if (Math.random() < 0.5) {
       logger.error('there was an err');
     }
     res.json({ message: 'hi there' });
   });

   app.listen(3000, () => {
     console.log('listening on port 3000');
   });
   ```

5. Run the app in 1st terminal (`npm start`), send requests using `loadtest` in 2nd terminal (`loadtest -c 10 --rps 200 http://localhost:3000/`) and check the logs in the newrelic dashboard.

   <img width="1023" alt="Screenshot 2024-05-25 at 8 32 33 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/c7be8728-3520-4770-ad9d-b2ffea53b202">


<br>

> Note: Customize your Dashboard by clicking on the 'Add to Dashboard' button. Now, your customized dashboard will look more organized and according to your needs.
> <img width="1023" alt="Screenshot 2024-05-25 at 8 32 34 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/1aa22233-ace8-4fc3-914c-f7fa80c94a5f">

---

## Understanding P99 and P95

- When we talk about the performance of an application, we often talk about the **average** response time of the application.

- But, the average response time does not give the full picture of the performance of the application.

- For example, if the average response time of an application is 100ms, it means that 50% of the requests are served in less than 100ms and 50% of the requests are served in more than 100ms.

- But, what if in real life, almost 95% are doing fine (served in less than 100ms) and only 5% are taking more time (served in more than 100ms). In this case, the average response time metric gets distorts and does not give the full picture.

- Thus, we use the **P99** and **P95** metrics to get a better understanding of the performance of the application.

- P99 shows the max response time of the 99% (100ms) of the requests and P95 (50ms) shows the max response time of the 95% of the requests.

- If the P99 and P95 are high, it means that the application is not performing well for most of the requests.

- In that case, the `oncall` person should be notified to look into the issue.

- To check the P99 and P95 metrics, go to the **APM & Services** -> Click on the service you want to check -> Click on the **% icon** to see both P99 and P95 graphs.

  <br>
    
  <img width="1023" alt="Screenshot 2024-05-25 at 8 32 35 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/3ac5af3e-a19b-4c46-86f9-e0b2f27d8a15">