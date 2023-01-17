const e = require("express");
const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
} = require("./controllers");
const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

// Path Not Found Handler
app.use((req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
});

// Custom Error Handler
app.use((err, request, response, next) => {
  if (err.status) response.status(err.status).send({ message: err.msg });
  else next(err);
});

// PostgreSQL Error Code Handler
app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad Request" });
  } else next(err);
});

// Unhandled PostgreSQL Error Codes/Server Has Kaboomed
app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send("Internal Server Error");
});

module.exports = app;
