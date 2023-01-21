const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
