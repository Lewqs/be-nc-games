const {
  usersModels: { fetchUsers },
} = require("../models/index.models");
exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
