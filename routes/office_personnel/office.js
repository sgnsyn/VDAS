const express = require("express");
const { download_video, put_failure_report } = require("../../controllers/office/office");

const router = express.Router();

router.route("/upload").post(download_video);
router.route("/failure_report").post(put_failure_report);

module.exports = router;
