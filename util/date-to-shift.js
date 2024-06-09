function date_to_shift_convertor(date) {
  try {
    const { day, time } = date;
    if (!day || !time) {
      console.log("error in util date_to_shift_convertor, couldn't find day or time");
    }
    const timeArr = time.trim().split(":");
    const time_int = Number(timeArr[0] + timeArr[1]);
    morning = 600;
    evening = 1400;
    night = 2000;
    let shift = "";

    if (time_int >= morning && time_int < evening) {
      shift = "morning";
    }

    if (time_int >= evening && time_int < night) {
      shift = "evening";
    }

    if (time_int >= night || time_int < morning) {
      shift = "night";
    }

    return day.toLocaleLowerCase().trim() + "_" + shift.toLocaleLowerCase().trim();
  } catch (err) {
    console.log("error in util date_to_shift_convertor", err);
  }
}

module.exports = { date_to_shift_convertor };
