const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewByReviewId,
  getUsers,
  deleteCommentByCommentId,
} = require("./controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.patch("/api/reviews/:review_id", patchReviewByReviewId);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

// Path Not Found Handler
app.use((req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
});

// Custom Error Handler
app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ message: err.msg });
  else next(err);
});

// PostgreSQL Error Code Handler
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503" || err.code === "23502") {
    res.status(400).send({ message: "Bad Request" });
  } else next(err);
});

// Unhandled PostgreSQL Error Codes/Server Has Kaboomed
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

module.exports = app;
