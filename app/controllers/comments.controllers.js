const {
  commentsModels: { removeCommentByCommentId, updateCommentByCommentId },
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

exports.patchCommentByCommentId = (req, res, next) => {
  const {
    params: { comment_id },
    body: { inc_votes },
  } = req;
  updateCommentByCommentId(comment_id, inc_votes)
    .then((updated_comment) => {
      res.status(200).send({ updated_comment });
    })
    .catch(next);
};
