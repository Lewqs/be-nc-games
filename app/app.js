const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const cors = require("cors");
const {
  pathError,
  customError,
  psqlError,
  serverError,
} = require("./error-handlers");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use(pathError);
app.use(customError);
app.use(psqlError);
app.use(serverError);

module.exports = app;
