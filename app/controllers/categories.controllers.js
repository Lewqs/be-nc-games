const {
  categoriesModels: { fetchCategories },
} = require("../models/index.models");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
