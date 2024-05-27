const express = require("express");
const router = express.Router();
const { get_alerts_page } = require("../../controllers/admin/alert-logs");
const is_authorized = require("../../middlewares/authorize");

router.route("/").get(get_alerts_page);

module.exports = router;
