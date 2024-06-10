const express = require("express");
const router = express.Router();

const { get_cctv_page, get_add_cctv_page, get_remove_cctv_page } = require("../../controllers/admin/cctv");

router.route("/management").get(get_cctv_page);
router.route("/add").get(get_add_cctv_page);
router.route("/remove").get(get_remove_cctv_page);

module.exports = router;
