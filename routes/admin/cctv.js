const express = require("express");
const router = express.Router();

const {
  get_cctv_page,
  get_add_cctv_page,
  get_remove_cctv_page,
  create_cctv,
  get_cctv,
} = require("../../controllers/admin/cctv");

router.route("/").get(get_cctv);
router.route("/management").get(get_cctv_page);
router.route("/add").get(get_add_cctv_page);
router.route("/add").post(create_cctv);
router.route("/remove").get(get_remove_cctv_page);

module.exports = router;
