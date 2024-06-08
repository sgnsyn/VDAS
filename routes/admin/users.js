const express = require("express");
const router = express.Router();

const {
  load_all_users,
  create_user,
  update_user,
  delete_user,
  user_management_page,
  add_users_page,
  remove_users_page,
} = require("../../controllers/admin/users");

router.route("/").get(load_all_users);
router.route("/add").get(add_users_page);
router.route("/remove").get(remove_users_page);
router.route("/").post(create_user);
router.route("/:id").put(update_user);
router.route("/:id").delete(delete_user);
router.route("/management").get(user_management_page);

module.exports = router;
