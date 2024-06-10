function format_alert_log(alert) {
  alert_log = {};
  for (let elt of alert) {
    alert_log[elt.id] = {
      date: time_stamp_to_date(elt.date),
      camera_id: elt.camera_id,
      validity: format_validity(elt.alert_validity),
      filename: elt.filename,
    };
  }
  return alert_log;
}

function time_stamp_to_date(timestamp) {
  const date = new Date(Number(timestamp));
  const formatted_date = date.toISOString().split("T")[0];
  return formatted_date;
}

function format_validity(validity) {
  switch (validity.trim().toLowerCase()) {
    case "tp":
      return "True Posative";
    case "fp":
      return "False Posative";
    case "fn":
      return "False Negative";
    case "tn":
      return "True Negative";
  }
}

module.exports = { format_alert_log };
