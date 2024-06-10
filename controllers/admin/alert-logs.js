const path = require("path");
const { load_alerts } = require("../../models/admin/alert_log");
const { format_alert_log } = require("../../util/format-alert-log");

//@desc get user-management.html
//@route GET /management
//@access private
const get_alerts_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/alert_logs", "alert-logs.html"));
};
const get_alerts = async (req, res) => {
  const result = await load_alerts();
  if (result === "err") {
    return res.status(500).json({ success: false, message: "Internal error, Please try again later." });
  }

  const formatted_result = format_alert_log(result);
  return res.status(200).json(formatted_result);
};

module.exports = {
  get_alerts_page,
  get_alerts,
};
