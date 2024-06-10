const path = require("path");

//@desc get user-management.html
//@route GET /management
//@access private
const get_cctv_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/cctv", "cctv-management.html"));
};

//@desc get user-management.html
//@route GET /add
//@access private
const get_add_cctv_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/cctv", "add-cctv.html"));
};
//@desc get user-management.html
//@route GET /remove
//@access private
const get_remove_cctv_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/cctv", "remove-cctv.html"));
};

module.exports = {
  get_cctv_page,
  get_remove_cctv_page,
  get_add_cctv_page,
};
