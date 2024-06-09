const path = require("path");

const { b_compare } = require("../util/password-hash-compare");
const { get_credential } = require("../models/admin/user-model");

//@desc get login.html
//@route GET /login
//@access public
const get_login_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
};

//@desc post username and password
//@route post /login
//@access public
const login_auth = async (req, res) => {
  //authenticator should be added
  let { username, password } = req.body;
  username = username.trim();
  if (!username || !password) {
    return res.status(401).json({ success: false, message: "Invalid entry , please try again with valid value." });
  }

  if (username && password) {
    const user_db = await get_credential(username);

    if (!user_db) {
      return res.status(401).json({
        success: false,
        message: "This user doesn't exist.",
      });
    }

    // get hashsed password and compare with plain text
    const password_validty = await b_compare(password, user_db.password_hashed);
    if (password_validty === "err") {
      return res.status(500).json({ success: false, message: "Internal error, try again later." });
    }
    if (!password_validty) {
      return res.status(401).json({
        success: false,
        message: "Invalid password, try again with valid password!",
      });
    }

    req.session.user = {
      id: user_db.id,
      username: user_db.username,
      role: user_db.role,
    };

    let path = null;
    if (req.session.user.role === "admin") {
      path = `/admin/dashboard`;
    }
    if (req.session.user.role === "ground personnel") {
      path = `/ground_personnel/dashboard`;
    }

    if (!path) {
      return res.status(401).json({
        success: false,
        message: "Internal error, try again later",
      });
    }

    return res.status(200).json({ success: true, path });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ success: false, message: "Error logging out" });
    }
    res.redirect("/login");
  });
};

module.exports = {
  login_auth,
  get_login_page,
  logout,
};
