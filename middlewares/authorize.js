module.exports = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      return next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
};
