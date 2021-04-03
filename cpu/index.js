const express = require("express");

const app = express();

app.get('/', function(req, res, next) {
  res.send(1)
})

app.listen(3000)