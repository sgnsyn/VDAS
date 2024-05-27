const express = require("express");
const router = express.Router();

const {
  load_all_users,
  load_user,
  create_user,
  update_user,
  delete_user,
  user_management_page,
} = require("../../controllers/admin/users");

router.route("/").get(load_all_users);
// router.route("/:id").get(load_user); ---> bad route
router.route("/").post(create_user);
router.route("/:id").put(update_user);
router.route("/:id").delete(delete_user);
router.route("/management").get(user_management_page);

module.exports = router;
