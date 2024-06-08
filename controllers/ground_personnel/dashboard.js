const path = require("path");

//@desc get login.html
//@route GET /dashboard
//@access private
const get_dashboard_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/ground_personnel", "dashboard.html"));
};
//@desc get login.html
//@route GET /dashboard
//@access private
const get_alert_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/ground_personnel", "alert.html"));
};

module.exports = { get_alert_page, get_dashboard_page };
