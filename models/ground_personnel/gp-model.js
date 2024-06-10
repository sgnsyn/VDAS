const db_connection = require("../../config/db-connection");
const get_shift_id = async (shift) => {
  return new Promise((resolve, reject) => {
    const query_str = `SELECT id FROM weekdays WHERE shift = ?`;
    const values = [shift];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin user-model, get_user");
        return resolve("err");
      }

      if (result.length > 0) {
        return resolve(result[0].id);
      }
      return resolve(false);
    });
  });
};
const get_camera_id = async (ip) => {
  return new Promise((resolve, reject) => {
    const query_str = `SELECT id FROM camera WHERE ip = ?`;
    const values = [ip];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin user-model, get_user");
        return resolve("err");
      }

      if (result.length > 0) {
        return resolve(result[0].id);
      }
      return resolve(false);
    });
  });
};

const get_locations_id = async (id) => {
  return new Promise((resolve, reject) => {
    const query_str = `SELECT location_id FROM camera_location WHERE camera_id = ?`;
    const values = [id];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin user-model, get_user");
        return resolve("err");
      }

      if (result.length > 0) {
        return resolve(result);
      }
      return resolve(false);
    });
  });
};
const get_users_id = async (locations_id, shift_id) => {
  const user_id_arr = [];

  try {
    for (let elt of locations_id) {
      const location_id = elt.location_id;

      const query_str = `SELECT user_id FROM user_location_shift WHERE shift_id = ? AND location_id = ?`;
      const values = [shift_id, location_id];

      const user_id = await new Promise((resolve, reject) => {
        db_connection.query(query_str, values, (err, result, fields) => {
          if (err) {
            console.log(err, "error in admin user-model, get_user");
            return resolve("err");
          }

          if (result.length > 0) {
            return resolve(result);
          }
          return resolve(false);
        });
      });

      if (user_id === "err") {
        console.log("error in gp-model, get_user_id, user_id === er");
        continue;
      }
      if (!user_id) {
        console.log("error in gp-model, get_user_id, !user_id === true");
        continue;
      }
      for (let elt of user_id) {
        if (!user_id_arr.includes(elt.user_id)) {
          user_id_arr.push(elt.user_id);
        }
      }
    }
  } catch (err) {
    console.log("error in gp-model, get_user_id", err);
    user_id_arr = false;
  }
  return user_id_arr;
};

const get_location_name = async (locations_id) => {
  const location_names = [];
  try {
    for (let elt of locations_id) {
      let location_id = elt.location_id;

      const query_str = `SELECT name FROM location WHERE id = ?`;

      const location_name = await new Promise((resolve, reject) => {
        db_connection.query(query_str, location_id, (err, result, fields) => {
          if (err) {
            console.log(err, "error in admin user-model, get_user");
            return resolve("err");
          }

          if (result.length > 0) {
            return resolve(result);
          }
          return resolve(false);
        });
      });

      if (location_name === "err") {
        console.log("error in gp-model, get_location_n, location_name === er");
        continue;
      }
      if (!location_name) {
        console.log("error in gp-model, get_location_n, !location_name === true");
        continue;
      }

      location_names.push(location_name[0].name);
    }
  } catch (err) {
    console.log("error in gp-model, get_user_id", err);
    location_names = false;
  }
  return location_names;
};

const save_alert_log = async (data) => {
  const { date, camera_id, alert_validity, video_name } = data;
  const query_str = `INSERT INTO alert_log(date, camera_id, alert_validity, filename) VALUES(?,?,?,?)`;

  const values = [date, camera_id, alert_validity, video_name];
  db_connection.query(query_str, values, (err, result, fields) => {
    if (err) {
      console.log(err, "error in admin gp-model, save_alert_log");
    }
  });
};

const save_failure_report = async (data) => {
  const { date, reported_personnel, report_description } = data;
  const resolution_status = "unresolved";

  const query_str = `INSERT INTO failure_report (date, reported_personnel, resolution_status, report_description) VALUES (?, ?, ?, ?)`;

  const values = [date, reported_personnel, resolution_status, report_description];
  db_connection.query(query_str, values, (err, result, fields) => {
    if (err) {
      console.log(err, "error in admin gp-model, save_alert_log");
    }
  });
};

module.exports = {
  get_shift_id,
  get_camera_id,
  get_locations_id,
  get_users_id,
  get_location_name,
  save_alert_log,
  save_failure_report,
};
