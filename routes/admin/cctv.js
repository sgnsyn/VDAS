const express = require("express");
const router = express.Router();

const { get_cctv_page } = require("../../controllers/admin/cctv");

router.route("/").get(get_cctv_page);

module.exports = router;
