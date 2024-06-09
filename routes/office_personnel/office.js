const express = require("express");
const { download_video } = require("../../controllers/office/office");

const router = express.Router();

router.route("/upload").post(download_video);

module.exports = router;
