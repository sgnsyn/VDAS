const express = require("express");
const {
  get_reports_page,
  reports_page_resolved,
  reports_page_unresolved,
  get_reports,
  put_location,
} = require("../../controllers/admin/reports");
const router = express.Router();

router.route("/").get(get_reports_page);
router.route("/update").post(put_location);
router.route("/resolved").get(reports_page_resolved);
router.route("/unresolved").get(reports_page_unresolved);
router.route("/reports").get(get_reports);

module.exports = router;
