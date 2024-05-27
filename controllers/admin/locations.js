const path = require("path");

//@desc get user-management.html
//@route GET /management
//@access private
const get_locations_page = async (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../../views/admin/locations",
      "location-management.html"
    )
  );
};

module.exports = {
  get_locations_page,
};
