const express = require("express");
const router = express.Router();

const {
  create_user,
  delete_user,
  user_management_page,
  add_users_page,
  remove_users_page,
  get_all_users,
  edit_users_page,
} = require("../../controllers/admin/users");

router.route("/").get(get_all_users);
router.route("/:name").delete(delete_user);
router.route("/add").get(add_users_page);
router.route("/remove").get(remove_users_page);
router.route("/edit/:id").get(edit_users_page);
router.route("/").post(create_user);
router.route("/management").get(user_management_page);

module.exports = router;
