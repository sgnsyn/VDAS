const path = require("path");
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
  const { username, password } = req.body;

  if (username && password) {
    const user_db = await get_credential(username);

    if (!user_db) {
      return res.status(401).json({
        success: false,
        message: "This user doesn't exist.",
      });
    }

    if (!(password === user_db.password_hashed)) {
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
  console.log("successfully logout");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error logging out" });
    }
    res.redirect("/login");
  });
};

module.exports = {
  login_auth,
  get_login_page,
  logout,
};
