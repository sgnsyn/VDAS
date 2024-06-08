const db_connection = require("../../config/db-connection");

// creates a new user
const add_user = (first_name, middle_name, last_name, username, psk, role) => {
  return new Promise((resolve, reject) => {
    const query_str = `INSERT INTO users(first_name, middle_name, last_name, username, password_hashed, role)
VALUE(?, ?, ?, ?, ?, ?)`;
    const values = [first_name, middle_name, last_name, username, psk, role];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        resolve("err");
        console.log("error in admin user-model, add_user inserting user", err);
      }
      const query_str2 = `SELECT id FROM users WHERE username = ?`;

      db_connection.query(query_str2, username, (err, result, fields) => {
        if (err) {
          resolve("err");
          console.log("error in admin user-model, add_user querying id", err);
        }
        resolve(result[0]);
      });
    });
  });
};

// updates user's record

const edit_user = (id, username, psk, role) => {
  const query_str = `UPDATE users SET username = ?, psk = ?, role = ? WHERE id = ?`;
  const values = [username, psk, role, id];
  db_connection.query(query_str, values, (err, result, fields) => {
    if (err) {
      console.log("error in admin user-model, edit_user", err);
    }
  });
};

// removes user from database
const remove_user = (id) => {
  const query_str = `DELETE FROM users WHERE id = ?`;
  const values = [id];
  db_connection.query(query_str, values, (err, result, fields) => {
    if (err) {
      console.log("error in admin user-model, remove_user", err);
    }
  });
};

// fetches user password by username
const get_credential = async (username) => {
  return new Promise((resolve, reject) => {
    const query_str = `SELECT password_hashed, username, id, role FROM users WHERE username = ?`;
    const values = [username];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin user-model, get_user");
        return;
      }

      if (result.length > 0) {
        resolve(result[0]);
      }
      resolve(false);
    });
  });
};

// fetches username, first name, middle name, last name
const get_full_user_name = async (first_name, middle_name, last_name) => {
  return new Promise((resolve, reject) => {
    const query_str = `SELECT first_name, middle_name, last_name FROM users 
    WHERE first_name = ?  AND middle_name = ? AND last_name = ?`;

    const values = [first_name, middle_name, last_name];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin location-model, get_all_location");
        return reject("err");
      }
      return resolve(result);
    });
  });
};

// fetches all user names
const get_usernames = async () => {
  return new Promise((resolve, reject) => {
    const query_str = `SELECT username FROM users`;

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin location-model, get_all_location");
        return reject("err");
      }
      return resolve(result);
    });
  });
};

// add office_shift
const add_user_shift = async (id_db, formatted_shift) => {
  //get shift ids
  const shift_id_arr = [];
  for (let shift of formatted_shift) {
    const query_str = `SELECT id from weekdays WHERE shift = ?`;

    const shift_id = await new Promise((resolve, reject) => {
      db_connection.query(query_str, shift.trim().toLowerCase(), (err, result, fields) => {
        if (err) {
          console.log("error in admin user-model, fetch shif ids");
          resolve("err");
        }
        resolve(result);
      });
    });

    if (shift_id === "err") {
      console.log("coundl't find id for some shifts, shiftid ==err");
      continue;
    }
    if (shift_id.length === 0) {
      console.log("coundl't find id for some shifts, shiftid.length === 0");
      continue;
    }
    shift_id_arr.push(shift_id[0].id);
  }

  // set location for all shift id arr
  for (let shift of shift_id_arr) {
    const values = [id_db, shift];
    const query_str = `INSERT INTO office_shift (user_id, shift_id) VALUES(?,?);`;
    const result = await new Promise((resolve, reject) => {
      db_connection.query(query_str, values, (err, result, fields) => {
        if (err) {
          console.log(err, "error in admin user-model, add_user_shift");
          return resolve("err");
        }
        return resolve(true);
      });
    });
    if (result == "err") {
      return "err";
    }
  }
  return true;
};

// add user_location_shift
const add_user_location_shift = async (user_id, formatted_shift) => {
  //get shift id and location id
  const shift_id_obj = {};
  let result = true;
  for (let key of Object.keys(formatted_shift)) {
    let shift = formatted_shift[key]["shift"];

    const query_str = `SELECT id from weekdays WHERE shift = ?`;

    let shift_id = await new Promise((resolve, reject) => {
      db_connection.query(query_str, shift, (err, result, fields) => {
        if (err) {
          console.log("error in admin user-model, fetch shif ids");
          resolve("err");
        }
        resolve(result);
      });
    });

    if (shift_id === "err") {
      console.log("coundl't find id for some shifts, shiftidgp ==err");
      continue;
    }
    if (shift_id.length === 0) {
      console.log("coundl't find id for some shifts, shiftidgp.length === 0");
      continue;
    }
    shift_id = shift_id[0].id;
    const location_id_arr = [];

    // location array
    for (let location of formatted_shift[key]["location"]) {
      const query_str = `SELECT id from location WHERE name = ?`;

      let location_id = await new Promise((resolve, reject) => {
        db_connection.query(query_str, location, (err, result, fields) => {
          if (err) {
            console.log("error in admin user-model, fetch shif ids");
            resolve("err");
          }
          resolve(result);
        });
      });

      if (location_id === "err") {
        console.log("coundl't find id for some shifts, location_id ==err");
        continue;
      }
      if (location_id.length === 0) {
        console.log("coundl't find id for some shifts, location_id.length === 0");
        continue;
      }
      location_id = location_id[0].id;

      location_id_arr.push(location_id);
    }
    shift_id_obj[key] = { shift: shift_id, location_id_arr: location_id_arr };
  }

  //insert shift and location

  for (let key of Object.keys(shift_id_obj)) {
    const shift_id = shift_id_obj[key]["shift"];

    for (let location_id of shift_id_obj[key]["location_id_arr"]) {
      const values = [user_id, location_id, shift_id];
      const query_str = `INSERT INTO user_location_shift(user_id, location_id, shift_id) VALUE(?,?,?)`;
      result = await new Promise((resolve, reject) => {
        db_connection.query(query_str, values, (err, result, fields) => {
          if (err) {
            console.log(err, "error in admin user-model, add_user_shift");
            return resolve("err");
          }
          return resolve(true);
        });
      });
    }
  }
  return result;
};

module.exports = {
  add_user,
  get_usernames,
  edit_user,
  remove_user,

  get_credential,
  get_full_user_name,
  add_user_shift,
  add_user_location_shift,
};
