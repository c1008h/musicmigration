const express = require("express");
const app = express();
const api = require('./routes/api/index')

app.use('/api', api);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(8080, () => {
    console.log("App is listening on port 8080!\n");
});