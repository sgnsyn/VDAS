const db_connection = require("../../config/db-connection");
const load_alerts = async () => {
  return new Promise((resolve, reject) => {
    const query_str = "SELECT * FROM alert_log ORDER BY id ASC";

    db_connection.query(query_str, (err, result, fields) => {
      if (err) {
        console.log(err, "error in admin location-model, get_all_location");
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports = { load_alerts };
