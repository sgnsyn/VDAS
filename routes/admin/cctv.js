const express = require("express");
const router = express.Router();

const { get_cctv_page } = require("../../controllers/admin/cctv");
const is_authorized = require("../../middlewares/authorize");

router.route("/").get(get_cctv_page);

module.exports = router;
