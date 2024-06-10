const express = require("express");
const router = express.Router();
const {
  get_dashboard_page,
  get_id,
  get_video,
  get_feedback_page,
} = require("../../controllers/ground_personnel/dashboard");

router.route("/dashboard").get(get_dashboard_page);
router.route("/id").get(get_id);
router.route("/video").post(get_video);
router.route("/feedback").get(get_feedback_page);

module.exports = router;
