const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postCommentByReviewId,
  patchReviewByReviewId,
  postReview,
} = require("../controllers/reviews.controllers");

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReviewByReviewId);
reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postCommentByReviewId);

module.exports = reviewsRouter;
