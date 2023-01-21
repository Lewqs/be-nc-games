const commentsRouter = require("express").Router();
const {
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require("../controllers/comments.controllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentByCommentId)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
