const express = require("express");
const router = express.Router();
const { get_alerts_page, get_alerts } = require("../../controllers/admin/alert-logs");

router.route("/").get(get_alerts_page);
router.route("/logs").get(get_alerts);

module.exports = router;
