const {
  categoriesModels: { fetchCategories },
  reviewsModels: {
    fetchReviewById,
    fetchReviews,
    fetchCommentsByReviewId,
    updateReviewByReviewId,
    addCommentByReviewId,
    addReview,
  },
} = require("../models/index.models");

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

exports.postReview = (req, res, next) => {
  const { body } = req;
  addReview({ ...body })
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};
