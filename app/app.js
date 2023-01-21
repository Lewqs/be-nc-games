const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  pathError,
  customError,
  psqlError,
  serverError,
} = require("./error-handlers");

app.use(express.json());

app.use("/api", apiRouter);

app.use(pathError);
app.use(customError);
app.use(psqlError);
app.use(serverError);

module.exports = app;
