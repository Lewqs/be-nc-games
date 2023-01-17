const {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  addCommentByReviewId,
  updateReviewByReviewId,
} = require("../models");

exports.getCategories = (req, res, next) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  Promise.all([fetchCommentsByReviewId(review_id), fetchReviewById(review_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
  const {
    params: { review_id },
    body,
  } = req;
  Promise.all([
    fetchReviewById(review_id),
    addCommentByReviewId(review_id, { ...body }),
  ])
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchReviewByReviewId = (req, res, next) => {
  const {
    params: { review_id },
    body: { inc_votes },
  } = req;
  updateReviewByReviewId(review_id, inc_votes)
    .then((updated_review) => {
      res.status(200).send({ updated_review });
    })
    .catch(next);
};
