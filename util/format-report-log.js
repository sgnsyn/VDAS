function format_report(reports) {
  report_log = {};
  for (let elt of reports) {
    report_log[elt.id] = {
      date: time_stamp_to_date(Number(elt.date)),
      reported_by: elt.reported_personnel,
      description: elt.report_description,
      status: elt.resolution_status,
    };
  }
  return report_log;
}

function time_stamp_to_date(timestamp) {
  const date = new Date(Number(timestamp));
  const formatted_date = date.toISOString().split("T")[0];
  return formatted_date;
}
module.exports = { format_report };
