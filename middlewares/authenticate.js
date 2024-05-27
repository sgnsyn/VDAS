module.exports = (req, res, next) => {
  if (req.url === "/login" || req.url === "/login/auth") {
    return next();
  }
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};
