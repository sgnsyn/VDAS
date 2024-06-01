const express = require("express");
const {
  get_locations_page,
  add_location_page,
  remove_location_page,
  add_location,
  load_all_location,
  delete_location,
} = require("../../controllers/admin/locations");
const router = express.Router();
router.route("/").get(load_all_location);
router.route("/:name").delete(delete_location);
router.route("/management").get(get_locations_page);
router.route("/add").get(add_location_page);
router.route("/add").post(add_location);
router.route("/remove").get(remove_location_page);

module.exports = router;
