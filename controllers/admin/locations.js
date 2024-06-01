const path = require("path");
const {
  add_location_m,
  check_location,
  get_all_location,
  remove_location,
} = require("../../models/admin/location");

const TIMER = 1000;

//@desc get location-management.html
//@route GET /locations
//@access private
const get_locations_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/locations", "location-management.html"));
};

//@desc get add-location.html
//@route GET /locations/add
//@access private
const add_location_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/locations", "location-add.html"));
};

//@desc get remove-location.html
//@route GET /locations/remove
//@access private
const remove_location_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/admin/locations", "location-remove.html"));
};

//@desc save new location to db
//@route post/locations/add
//@access private
const add_location = async (req, res) => {
  const { location_desc, location_name } = req.body;
  if (location_desc && location_name) {
    const exists = await check_location(location_name);
    if (exists) {
      return res.status(401).json({ success: false, message: "This location already exists." });
    } else {
      const result = await add_location_m(location_name, location_desc);
      if (result) {
        return res.status(200).json({ success: true, message: "Location successfully added." });
      } else {
        return res
          .status(500)
          .json({ success: false, message: "Internal error, try again later." });
      }
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid entry , please try again with valid value." });
  }
};

//@desc save new location to db
//@route post/locations/add
//@access private
const load_all_location = async (req, res) => {
  get_all_location()
    .then((result) => {
      return res.status(200).json({ success: true, result });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ success: false, message: "Internal error, Please try again later." });
    });
};

//@desc delete location
//@route delete/locations/:name
//@access private

const delete_location = async (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid entry, Please try again later." });
  }
  remove_location(name)
    .then((result) => {
      return res.status(200).json({ success: true, message: "Location successfully removed" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ success: false, message: "Internal error, Please try again later." });
    });
};

module.exports = {
  get_locations_page,
  add_location_page,
  remove_location_page,
  add_location,
  load_all_location,
  delete_location,
};
