function format_role(role) {
  if (role === "op") {
    return "office personnel";
  }
  if (role === "gp") {
    return "ground personnel";
  }
  if (role === "a") {
    return "admin";
  }
}

function format_op_shift(shift) {
  shifts_arr = [];
  for (let key of Object.keys(shift)) {
    if (shift[key]) {
      shifts_arr.push(`${key}_${shift[key]}`);
    }
  }
  return shifts_arr;
}

function format_gp_shift(shift) {
  const shifts_obj = {};
  for (let key of Object.keys(shift)) {
    if (shift[key].shift) {
      const formatted_shift = `${key}_${shift[key]["shift"]}`;
      shifts_obj[key] = { shift: formatted_shift, location: shift[key].location };
    }
  }
  return shifts_obj;
}
module.exports = { format_role, format_op_shift, format_gp_shift };
