const categoriesRouter = require("express").Router();
const { getCategories } = require("../controllers/categories.controllers");

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
