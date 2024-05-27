const express = require("express");
const {
  get_dashboard_page,
} = require("../../controllers/ground_personnel/dashboard");
const router = express.Router();

router.route("/dashboard").get(get_dashboard_page);

module.exports = router;
