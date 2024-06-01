const path = require("path");

const { add_user, remove_user, edit_user, get_user } = require("../../models/admin/user-model");
const generate_id = require("../../util/id-generator");

//@desc get all users
//@route GET /user
//@access public
const load_all_users = (req, res) => {
  res.status(200).json({ message: "there you go" });
};

//@desc get individual user
//@route GET /user:id
//@access public
const load_user = async (req, res) => {
  const id = req.params.id;

  const user = await get_user(id);
  console.log(user);
  res.status(200).json(user[0]);
};

//@desc create new  user
//@route POST /user
//@access public
const create_user = (req, res) => {
  const { id, username, psk, role } = req.body;
  console.log(id, username, psk, role);

  add_user(username, psk, role, id);

  if (!id) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  res.status(201).json({ message: "got it" });
};

//@desc update individual user
//@route PUT /user:id
//@access public
const update_user = (req, res) => {
  const id = req.params.id;
  const { username, psk, role } = req.body;

  edit_user(id, username, psk, role);
  res.status(200).json({ message: `update users of id: ${req.params.id}` });
};

//@desc delete individual user
//@route DELETE /user:id
//@access public
const delete_user = (req, res) => {
  const id = req.params.id;
  remove_user(id);
  res.status(200).json({ message: `delete user id: ${req.params.id}` });
};

//@desc get user-management.html
//@route GET /management
//@access private
const user_management_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/users", "user-management.html"));
};

module.exports = {
  load_all_users,
  load_user,
  create_user,
  update_user,
  delete_user,
  user_management_page,
};
