import express from "express";
import { monitor } from "./middlewares/monitor";
import { requestCount } from './middlewares/requestCounter';

const app = express();

app.use(express.json());
app.use(monitor);
app.use(requestCount);

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

app.listen(3000);