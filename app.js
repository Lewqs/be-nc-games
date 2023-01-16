const express = require("express");
const { getCategories, getReviews } = require("./controllers");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Internal server error");
});

module.exports = app;
