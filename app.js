const e = require("express");
const express = require("express");
const { getCategories, getReviews, getReviewById } = require("./controllers");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);

app.use((err, request, response, next) => {
  if (err.status) response.status(err.status).send({ message: err.msg });
  else next(err);
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad Request" });
  } else next(err);
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Internal server error");
});

module.exports = app;
