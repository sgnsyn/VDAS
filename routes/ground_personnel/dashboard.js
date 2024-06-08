const express = require("express");
const router = express.Router();
const { get_dashboard_page, get_alert_page } = require("../../controllers/ground_personnel/dashboard");

router.route("/dashboard").get(get_dashboard_page);
router.route("/alert").get(get_alert_page);
// router.route("/upload").get();

module.exports = router;
