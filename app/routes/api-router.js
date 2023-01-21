const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/endpoints.controller");
const {
  categoriesRouter,
  reviewsRouter,
  commentsRouter,
  usersRouter,
} = require("./index-routes");

apiRouter.get("/", getEndpoints);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
