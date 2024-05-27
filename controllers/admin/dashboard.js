const path = require("path");

//@desc get login.html
//@route GET /dashboard
//@access private
const get_dashboard_page = async (req, res) => {
  res.render("admin/dashboard", {
    role: req.session.user.role,
    username: req.session.user.username,
  });
};

module.exports = { get_dashboard_page };
