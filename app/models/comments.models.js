const db = require("../../db/connection");

exports.removeCommentByCommentId = (id) => {
  const queryStr = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
    `;
  return db.query(queryStr, [id]).then(({ rowCount }) => {
    if (rowCount < 1)
      return Promise.reject({
        status: 404,
        msg: `Comment ID: ${id} Not Found`,
      });
  });
};

exports.updateCommentByCommentId = (id, inc_votes) => {
  const queryStr = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`;
  return db
    .query(queryStr, [inc_votes, id])
    .then(({ rows: updated_comment, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comment ID '${id}' Not Found`,
        });
      }
      return updated_comment[0];
    });
};
