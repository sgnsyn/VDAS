const express = require("express");
const router = express.Router();

const { get_login_page, login_auth, logout } = require("../controllers/auth");

router.route("/login").get(get_login_page);
router.route("/login/auth").post(login_auth);
router.route("/logout").get(logout);

module.exports = router;
