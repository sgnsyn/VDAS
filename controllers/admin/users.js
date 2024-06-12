const path = require("path");

const {
  add_user,
  remove_user,
  edit_user,
  get_full_user_name,
  get_usernames,
  add_user_shift,
  add_user_location_shift,
  load_all_users,
} = require("../../models/admin/user-model");

const validate_user = require("../../util/new-user-validator");
const { format_role, format_op_shift, format_gp_shift } = require("../../util/format-inputs");
const { b_hash } = require("../../util/password-hash-compare");

//@desc get all users
//@route GET /user
//@access public
const get_all_users = (req, res) => {
  load_all_users()
    .then((result) => {
      return res.status(200).json({ success: true, result });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: "Internal error, Please try again later." });
    });
};

//@desc create new  user
//@route POST /user
//@access public
const create_user = async (req, res) => {
  let { first_name, middle_name, last_name, username, password, confirm_password, role } = req.body;

  //check if all fields have been inserted
  if (!first_name || !middle_name || !last_name || !username || !password || !confirm_password || !role) {
    return res.status(401).json({ success: false, message: "Invalid entry , please try again with valid value." });
  }

  //trim extra spaces from fields
  first_name = first_name.trim().toLowerCase();
  middle_name = middle_name.trim().toLowerCase();
  last_name = last_name.trim().toLowerCase();
  username = username.trim();
  password = password.trim();
  confirm_password = confirm_password.trim();
  role = role.trim();

  //check inputs validity
  const input_validty = validate_user(
    first_name,
    middle_name,
    last_name,
    username,
    role,
    password,
    confirm_password
  );
  if (!input_validty.validity) {
    return res.status(401).json({ success: false, message: input_validty.message });
  }

  //check if full name is in db
  const full_name_db = await get_full_user_name(first_name, middle_name, last_name);
  if (full_name_db === "err") {
    return res.status(500).json({ success: false, message: "Internal error, try again later." });
  }
  if (full_name_db.length !== 0) {
    return res
      .status(401)
      .json({ success: false, message: `user ${first_name} ${middle_name} ${last_name} exists.` });
  }

  //check if user name is in db
  const username_db = await get_usernames();
  if (username_db === "err") {
    return res.status(500).json({ success: false, message: "Internal error, try again later." });
  }
  let username_db_arr = [];
  for (let obj of username_db) {
    username_db_arr.push(obj.username);
  }

  if (username_db_arr.includes(username)) {
    return res.status(401).json({ success: false, message: `username ${username} already exists.` });
  }

  // encrypt user password
  const hashed_password = await b_hash(password);
  if (hashed_password === "err") {
    return res.status(500).json({ success: false, message: "Internal error, try again later." });
  }

  // format role and insert into db
  const formatted_role = format_role(role);
  let id_db = await add_user(first_name, middle_name, last_name, username, hashed_password, formatted_role);
  if (id_db === "err" || id_db.length <= 0) {
    return res.status(500).json({ success: false, message: "Internal error, try again later." });
  }
  id_db = id_db.id;

  // if user op prepare get id of shift get id of user, make add it office shift
  if (role === "op") {
    const shift = req.body.shift;
    const formatted_shift = format_op_shift(shift);
    const result_shift = await add_user_shift(id_db, formatted_shift);
    if (result_shift === "err")
      return res.status(500).json({ success: false, message: "Internal error, try again later." });
  }
  // if user  gp gat id of user, get id of shift, for every user create user_user
  if (role === "gp") {
    const shift = req.body.shift;
    const formatted_shift = format_gp_shift(shift);
    const result_shift = await add_user_location_shift(id_db, formatted_shift);
    if (result_shift === "err")
      return res.status(500).json({ success: false, message: "Internal error, try again later." });
  }
  // add_user(username, psk, role, id);

  return res.status(200).json({ success: true, message: "user successfully added." });
};

//@desc get user-management.html
//@route GET /management
//@access private
const user_management_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/users", "user-management.html"));
};

//@desc get add-users.html
//@route GET /users/add
//@access private
const add_users_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/users", "user-add.html"));
};

//@desc get remove-users.html
//@route GET /users/remove
//@access private
const remove_users_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/users", "user-remove.html"));
};
const edit_users_page = async (req, res) => {
  res.render("admin/users/user-edit", {
    role: req.session.user.role,
    username: req.session.user.username,
  });
};

//@desc delete individual user
//@route DELETE /user:id
//@access public
const delete_user = async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.status(400).json({ success: false, message: "Invalid entry, Please try again later." });
  }
  remove_user(name)
    .then((result) => {
      return res.status(200).json({ success: true, message: "User successfully removed" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: "Internal error, Please try again later." });
    });
};

module.exports = {
  get_all_users,
  create_user,
  delete_user,
  user_management_page,
  add_users_page,
  remove_users_page,
  edit_users_page,
};
