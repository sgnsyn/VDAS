const path = require("path");

//@desc get user-management.html
//@route GET /management
//@access private
const get_reports_page = async (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../../views/admin/failure_reports",
      "failure-reports.html"
    )
  );
};

module.exports = {
  get_reports_page,
};
