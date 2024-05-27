const path = require("path");

//@desc get user-management.html
//@route GET /management
//@access private
const get_alerts_page = async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../views/admin/alert_logs", "alert-logs.html")
  );
};

module.exports = {
  get_alerts_page,
};
