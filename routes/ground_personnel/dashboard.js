const express = require("express");
const router = express.Router();
const {
  get_dashboard_page,
  get_alert_page,
  get_id,
  get_video,
} = require("../../controllers/ground_personnel/dashboard");

router.route("/dashboard").get(get_dashboard_page);
router.route("/alert").get(get_alert_page);
router.route("/id").get(get_id);
router.route("/video").post(get_video);
// router.route("/upload").get();

module.exports = router;
