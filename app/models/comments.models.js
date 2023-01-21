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
