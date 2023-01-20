const {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  addCommentByReviewId,
  updateReviewByReviewId,
  fetchUsers,
  removeCommentByCommentId,
} = require("../models");
const endpoints = require("../endpoints.json");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const {
    query: { category, sort_by, order },
  } = req;
  fetchCategories()
    .then((categories) => {
      const categoryNamesArr = categories.map((category) => category.slug);
      return fetchReviews(category, sort_by, order, categoryNamesArr);
    })
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
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

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

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

exports.getAPI = (req, res, next) => {
  res.status(200).send({ endpoints });
};
