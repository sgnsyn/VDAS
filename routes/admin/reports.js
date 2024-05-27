const express = require("express");
const { get_reports_page } = require("../../controllers/admin/reports");
const router = express.Router();

router.route("/").get(get_reports_page);

module.exports = router;
