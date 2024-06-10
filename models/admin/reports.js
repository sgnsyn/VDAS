const db_connection = require("../../config/db-connection");
const load_reports = async () => {
  return new Promise((resolve, reject) => {
    const query_str = `SELECT * FROM failure_report`;

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin location-model, get_all_location");
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const put_report = async (id) => {
  return new Promise((resolve, reject) => {
    const query_str = `UPDATE failure_report SET resolution_status = "resolved" WHERE id  = ?`;

    db_connection.query(query_str, id, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin location-model, get_all_location");
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports = { load_reports, put_report };
