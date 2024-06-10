const path = require("path");
const { load_reports, put_report } = require("../../models/admin/reports");
const { format_report } = require("../../util/format-report-log");

//@desc get user-management.html
//@route GET /management
//@access private
const get_reports_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/failure_reports", "failure-reports.html"));
};
const reports_page_resolved = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/failure_reports", "resolved.html"));
};
const reports_page_unresolved = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/failure_reports", "unresolved.html"));
};

const get_reports = async (req, res) => {
  const result = await load_reports();
  if (result === "err") {
    return res.status(500).json({ success: false, message: "Internal error, Please try again later." });
  }

  const formatted_report = await format_report(result);

  return res.status(200).json(formatted_report);
};

const put_location = async (req, res) => {
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid entry, Please try again later." });
  }
  put_report(id)
    .then((result) => {
      return res.status(200).json({ success: true, message: "Status succesfully updated successfully removed" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: "Internal error, Please try again later." });
    });
};

module.exports = {
  get_reports_page,
  reports_page_resolved,
  reports_page_unresolved,
  get_reports,
  put_location,
};
