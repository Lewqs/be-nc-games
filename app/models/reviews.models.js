const db = require("../../db/connection");

exports.fetchReviews = (
  category,
  sort_by = "created_at",
  order = "desc",
  validCategoriesQueries,
  limit = 10,
  p
) => {
  const validSortByQueries = [
    "review_id",
    "title",
    "owner",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrdersQueries = ["asc", "desc"];

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Enter a valid sort_by query (See endpoints.md)",
    });
  }
  if (!validOrdersQueries.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Enter a valid order query (asc|desc)",
    });
  }

  let queryStr = `
      SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.category, reviews.created_at, 
        reviews.votes, COUNT(comment_id)::int AS comment_count FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id
  `;

  if (category) {
    queryStr += ` WHERE category = $1`;
  }

  queryStr += ` GROUP BY reviews.review_id`;
  queryStr += ` ORDER BY ${sort_by} ${order.toUpperCase()}`;
  queryStr += ` LIMIT ${limit}`;

  if (p) {
    queryStr += ` OFFSET ${(p - 1) * limit};`;
  }

  return db
    .query(queryStr, category ? [category] : [])
    .then(({ rows: reviews, rowCount }) => {
      if (
        rowCount < 1 &&
        category !== undefined &&
        !validCategoriesQueries.includes(category)
      ) {
        return Promise.reject({
          status: 404,
          msg: `Category '${category}' Not Found`,
        });
      }

      if (rowCount < 1 && p) {
        return Promise.reject({
          status: 404,
          msg: `Page Not Found`,
        });
      }
      return reviews;
    });
};

exports.fetchReviewById = (id) => {
  const queryStr = `SELECT reviews.*, COUNT(comment_id)::int AS comment_count FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;
  `;
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
    .then(({ rows: postedComment, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ID: ${id} Not Found`,
        });
      }
      return postedComment[0];
    });
};

exports.updateReviewByReviewId = (id, inc_votes) => {
  const queryStr = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;`;
  return db
    .query(queryStr, [inc_votes, id])
    .then(({ rows: updated_review, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Review ID: ${id} Not Found`,
        });
      }
      return updated_review[0];
    });
};

exports.addReview = (commentObj) => {
  const { title, designer, owner, review_img_url, review_body, category } =
    commentObj;
  const queryStr = `
  INSERT INTO reviews 
  (title, designer, owner, review_img_url, review_body, category)
  VALUES($1,$2,$3,$4,$5,$6)
  RETURNING *
      `;

  const emptyFields = [
    title,
    designer,
    owner,
    review_img_url,
    review_body,
    category,
  ].some((val) => val === "" || val === undefined);

  if (emptyFields) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return db
    .query(queryStr, [
      title,
      designer,
      owner,
      review_img_url,
      review_body,
      category,
    ])
    .then(({ rows }) => {
      return { ...rows[0], comment_count: 0 };
    });
};
