const format = require("pg-format");
const db = require("../db/connection");

exports.fetchCategories = () => {
  const queryStr = "SELECT * FROM categories;";
  return db.query(queryStr).then(({ rows: categories }) => {
    return categories;
  });
};

exports.fetchReviews = () => {
  const queryStr = `
  SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.category,
  reviews.created_at, reviews.votes, COUNT(comment_id)::int AS comment_count FROM reviews
  JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at desc;`;
  return db.query(queryStr).then(({ rows: reviews }) => {
    return reviews;
  });
};

exports.fetchReviewById = (id) => {
  const queryStr = format(`SELECT * FROM reviews WHERE review_id = %L;`, id);
  return db.query(queryStr).then(({ rows: reviews }) => {
    if (!reviews[0]) return Promise.reject({ status: 404, msg: "Not Found" });
    return reviews[0];
  });
};
