const db_connection = require("../../config/db-connection");

const add_location_m = (name, description) => {
  return new Promise((resolve, reject) => {
    const query_str = "INSERT INTO `location` (`name`, `description`) VALUES(?, ?)";
    const values = [name, description];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log("error in admin add_location_model, add_user", err);
        return resolve(false);
      }
    });
    return resolve(true);
  });
};

const check_location = (name) => {
  return new Promise((resolve, reject) => {
    const query_str = "SELECT name FROM location";

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log("error in admin check_location", err);
        return resolve(true);
      }
      console.log(result, "reslt");
      for (let elt of result) {
        if (elt.name === name) {
          return resolve(true);
        }
      }

      return resolve(false);
    });
  });
};

const get_all_location = async () => {
  return new Promise((resolve, reject) => {
    const query_str = "SELECT name, description FROM location ORDER BY id DESC";

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin location-model, get_all_location");
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const remove_location = async (name) => {
  return new Promise((resolve, reject) => {
    const query_str = `DELETE FROM location WHERE name = ?`;
    const values = [name];
    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log("error in admin location-model, remove_location", err);
        return reject(err);
      }
      return resolve();
    });
  });
};

module.exports = { add_location_m, check_location, get_all_location, remove_location };
