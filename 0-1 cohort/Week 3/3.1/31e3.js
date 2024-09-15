//kidney validation with zod

const express = require("express");
const app = express();
const port = 7003;

const z = require('zod');

const kidneysInput = z.literal("1").or(z.literal("2")); //schema

app.post("/health-checkup", function (req, res) {
  // do something with kidney here
  const kidneyId = req.body.kidneyId;
  const validation = kidneysInput.safeParse(kidneyId); //input validation with schema comparison
  if (!validation.success) {
    res.send("Incorrect input");
    return;
  }
  res.send("Your kidney id is" + kidneyId);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});