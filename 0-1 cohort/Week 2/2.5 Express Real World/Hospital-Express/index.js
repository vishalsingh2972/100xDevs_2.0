const express = require("express");

const app = express();

function sum(n) {
  let ans = 0;
  for (i = 1; i <= n; i++) {
    ans += i;
  }
  return ans;
}

app.get("/", function (req, res) {
  const n = req.query.n;
  const ans = sum(n);
  res.send(`hi there is ${ans}`);
});

app.listen(3000);
