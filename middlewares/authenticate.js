module.exports = (req, res, next) => {
  if (
    req.url === "/login" ||
    req.url === "/login/auth" ||
    req.url === "/office/upload" ||
    req.url === "/office" ||
    req.url === "/office/failure_report"
  ) {
    return next();
  }
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};
