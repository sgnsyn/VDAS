const path = require("path");

//@desc get user-management.html
//@route GET /management
//@access private
const get_cctv_page = async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../views/admin/cctv", "cctv-management.html")
  );
};

module.exports = {
  get_cctv_page,
};
