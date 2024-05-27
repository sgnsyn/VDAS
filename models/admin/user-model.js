const db_connection = require("../../config/db-connection");

// creates a new user
const add_user = (username, psk, role, id) => {
  return new Promise((resolve, reject) => {
    const query_str = `insert into users value(
        ?, ?, ?, ?
        )`;
    const values = [id, username, psk, role];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) console.log("error in admin user-model, add_user");
    });
    resolve();
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
// fetches a specific user from the database

const get_user = async (id) => {
  const result = await new Promise((resolve, reject) => {
    let result_array = [];
    const query_str = `SELECT * FROM users WHERE id = ?`;
    const values = [id];

    db_connection.query(query_str, values, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin user-model, get_user");
        return;
      }
      result_array = result;
      resolve(result_array);
    });
  });
  return result;
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

// fetches all users id
const get_all_id = async () => {
  const result = await new Promise((resolve, reject) => {
    let result_array = [];
    const query_str = "select id from users";

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin user-model, get_all_id");
        return;
      }
      result_array = result.map((element) => element.id);
      resolve(result_array);
    });
  });
  return result;
};

// assignms users shift

module.exports = {
  add_user,
  get_all_id,
  edit_user,
  remove_user,
  get_user,
  get_credential,
};
