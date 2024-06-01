const express = require("express");
const router = express.Router();
const { get_alerts_page } = require("../../controllers/admin/alert-logs");

router.route("/").get(get_alerts_page);

module.exports = router;
