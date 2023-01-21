const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewByReviewId,
} = require("../controllers/reviews.controllers");

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.patch("/:review_id", patchReviewByReviewId);
reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);
reviewsRouter.post("/:review_id/comments", postCommentByReviewId);

module.exports = reviewsRouter;
