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
  const queryStr = `SELECT * FROM reviews WHERE review_id = $1;`;
  return db.query(queryStr, [id]).then(({ rows: reviews, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404, msg: `Review ID: ${id} Not Found` });
    }
    return reviews[0];
  });
};

exports.fetchCommentsByReviewId = (id) => {
  const queryStr = `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC
    `;
  return db.query(queryStr, [id]).then(({ rows: comments }) => {
    return comments;
  });
};

exports.addCommentByReviewId = (id, commentObj) => {
  const { username, body } = commentObj;
  const queryStr = `
      INSERT INTO comments
        (review_id, author, body)
      VALUES
        ($1, $2, $3)
      RETURNING *;
      `;
  return db
    .query(queryStr, [id, username, body])
    .then(({ rows: postedComment }) => {
      return postedComment[0];
    });
};

exports.updateReviewByReviewId = (id, inc_value) => {
  const queryStr = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;`;
  return db
    .query(queryStr, [inc_value, id])
    .then(({ rows: updated_review }) => {
      return updated_review[0];
    });
};
