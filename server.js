const express = require("express");
const app = express();
const port = process.env.PORT || 3006;

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(8080, () => {
  console.log(`Server is running on port ${port}`);
});