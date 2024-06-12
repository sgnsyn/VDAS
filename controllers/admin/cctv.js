const path = require("path");
const { check_cctv, add_cctv, add_cctv_location, load_all_cctv } = require("../../models/admin/cctv");

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

//@desc get user-management.html
//@route GET /remove
//@access private
const create_cctv = async (req, res) => {
  const { locations, camera_ip } = req.body;
  if (locations && camera_ip) {
    const exists = await check_cctv(camera_ip);
    if (exists) {
      return res.status(401).json({ success: false, message: "A CCTV with this ip already exists." });
    } else {
      const id = await add_cctv(camera_ip);
      if (!id) {
        return res.status(500).json({ success: false, message: "Internal error, try again later." });
      }
      const result = await add_cctv_location(id, locations);
      if (result) {
        return res.status(200).json({ success: true, message: "CCTV successfully added." });
      } else {
        return res.status(500).json({ success: false, message: "Internal error, try again later." });
      }
    }
  } else {
    return res.status(401).json({ success: false, message: "Invalid entry , please try again with valid value." });
  }
};

const get_cctv = async (req, res) => {
  load_all_cctv()
    .then((result) => {
      return res.status(200).json({ success: true, result });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, message: "Internal error, Please try again later." });
    });
};
module.exports = {
  get_cctv_page,
  get_remove_cctv_page,
  get_add_cctv_page,
  create_cctv,
  get_cctv,
};
