const db_connection = require("../../config/db-connection");

const check_cctv = (ip) => {
  return new Promise((resolve, reject) => {
    const query_str = "SELECT ip FROM camera";

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log("error in admin check_location", err);
        return resolve(true);
      }
      for (let elt of result) {
        if (elt.ip === ip) {
          return resolve(true);
        }
      }

      return resolve(false);
    });
  });
};

const add_cctv_location = (id, locations) => {
  return new Promise((resolve, reject) => {
    for (let loc of locations) {
      const query_str = "SELECT id FROM location WHERE name = ?";
      db_connection.query(query_str, loc, (err, result, fields) => {
        if (err) {
          console.log("error in admin add_cctv_location", err);
          return resolve(false);
        }
        const loc_id = result[0].id;
        const query_str2 = `INSERT INTO camera_location(camera_id, location_id) VALUE(?,?)`;
        const values = [id, loc_id];
        db_connection.query(query_str2, values, (err, result, fields) => {
          if (err) {
            console.log("error in admin add_cctv", err);
            return resolve(false);
          }
        });
      });
    }
    return resolve(true);
  });
};

const add_cctv = (ip) => {
  return new Promise((resolve, reject) => {
    const query_str = `INSERT INTO camera(ip) value(?)`;
    db_connection.query(query_str, ip, (err, result, fields) => {
      if (err) {
        console.log("error in admin add_cctv", err);
        return resolve(false);
      }
      const query_str2 = `SELECT id FROM camera WHERE ip = ?`;
      db_connection.query(query_str2, ip, (err, result, fields) => {
        if (err) {
          console.log("error in admin add_cctv", err);
          return resolve(false);
        }
        if (result.length > 0) {
          return resolve(result[0].id);
        }
        return resolve(false);
      });
    });
  });
};
const load_all_cctv = async () => {
  return new Promise((resolve, reject) => {
    const query_str = "SELECT id, ip FROM camera ORDER BY id DESC";

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin location-model, get_all_location");
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports = { check_cctv, add_cctv, add_cctv_location, load_all_cctv };
