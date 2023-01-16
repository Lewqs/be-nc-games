const db = require("../db/connection");

exports.fetchCategories = () => {
  const queryStr = "SELECT * FROM categories;";
  return db.query(queryStr).then(({ rows: categories }) => {
    return categories;
  });
};
