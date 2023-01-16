const { fetchCategories } = require("../models");

exports.getCategories = (req, res, next) => {
  return fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
