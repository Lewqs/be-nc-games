const db = require("../../db/connection");

exports.fetchUsers = () => {
  const queryStr = `SELECT * FROM users;`;
  return db.query(queryStr).then(({ rows: users }) => {
    return users;
  });
};

exports.fetchUserByUsername = (username) => {
  const queryStr = `
  SELECT * FROM users
  WHERE username = $1
  `;

  return db.query(queryStr, [username]).then(({ rows: user, rowCount }) => {
    if (rowCount < 1) {
      return Promise.reject({
        status: 404,
        msg: `Username '${username}' Not Found`,
      });
    } else return user[0];
  });
};
