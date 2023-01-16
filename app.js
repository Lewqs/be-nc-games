const express = require("express");
const { getCategories } = require("./controllers");
const app = express();

app.get("/api/categories", getCategories);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Internal server error");
});

module.exports = app;
