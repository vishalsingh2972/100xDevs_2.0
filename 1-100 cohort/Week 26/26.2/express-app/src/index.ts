import express, { response } from "express";
import { monitor } from "./middlewares/monitor";
import { requestCount } from './middlewares/requestCount';
import client from "prom-client";
import { userCount } from "./middlewares/activeUsers";
import { responseTimeDistribution } from "./middlewares/responseTimeHistogram";

const app = express();

app.use(express.json());
app.use(monitor);
app.use(requestCount); //Counter
app.use(userCount); //Gauge
app.use(responseTimeDistribution); //Histogram

app.get("/user", (req, res) => {
  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.post("/user", (req, res) => {
  const user = req.body;
  res.send({
    ...user,
    id: 1,
  });
});

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set('Content-Type', client.register.contentType);
  res.end(metrics);
})

app.listen(3000);