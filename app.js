const express = require("express");
const { getCategories } = require("./controllers");
const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ message: err.message });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.code) console.log(err);
  else next(err);
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Internal server error");
});

module.exports = app;
