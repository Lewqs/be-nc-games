const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewByReviewId,
} = require("../controllers/reviews.controllers");

reviewsRouter.get("/", getReviews);
reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewByReviewId);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

module.exports = reviewsRouter;
