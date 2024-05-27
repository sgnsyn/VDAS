const { constants } = require("../constants");
const error_handler = (err, req, res, next) => {
  const status_code = res.statusCode ? res.statusCode : 500;
  console.log("dont forget to modify the error handler middleware");
  switch (status_code) {
    case constants.VALIDATION_ERROR:
      res.json({ title: "Validation Failed", message: err.message });
      break;

    case constants.NOT_FOUND:
      res.json({ title: "Not Found", message: err.message });
      break;

    case constants.UNAUTHORIZED:
      res.json({ title: "Unauthorized", message: err.message });
      break;

    case constants.FORBIDDEN:
      res.json({ title: "Forbidden", message: err.message });
      break;
    case constants.SERVER_ERROR:
      res.json({ title: "Server Error", message: err.message });
      break;

    default:
      console.log("no error");
  }
};
module.exports = error_handler;
