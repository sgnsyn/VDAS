const express = require("express");
const { download_video, get_video, download } = require("../../controllers/office/office");

const router = express.Router();

router.route("/upload").post(download_video);
router.route("/upload").get(get_video);

module.exports = router;
