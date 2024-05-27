const express = require("express");
const { get_locations_page } = require("../../controllers/admin/locations");
const router = express.Router();

router.route("/").get(get_locations_page);

module.exports = router;
