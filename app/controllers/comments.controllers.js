const {
  commentsModels: { removeCommentByCommentId },
} = require("../models/index.models");

exports.deleteCommentByCommentId = (req, res, next) => {
  const {
    params: { comment_id },
  } = req;
  removeCommentByCommentId(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
