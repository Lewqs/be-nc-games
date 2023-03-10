exports.pathError = (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
};

exports.customError = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ message: err.msg });
  else next(err);
};

exports.psqlError = (err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "2201W" ||
    err.code === "42703" ||
    err.code === "2201X"
  ) {
    res.status(400).send({ message: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Not Found" });
  } else next(err);
};

exports.serverError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server Error");
};
