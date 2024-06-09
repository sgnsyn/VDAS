const path = require("path");
const fs = require("fs");
const { date_to_shift_convertor } = require("../../util/date-to-shift");
const {
  get_shift_id,
  get_camera_id,
  get_locations_id,
  get_users_id,
  get_location_name,
  save_alert_log,
} = require("../../models/ground_personnel/gp-model");

const download_video = async (req, res) => {
  const { json_data, video_blob } = req.body;
  if (video_blob && json_data) {
    const video_buffer = Buffer.from(video_blob, "base64");

    const videos_dir = path.join(__dirname, "../../../videos");
    if (!fs.existsSync(videos_dir)) {
      fs.mkdirSync(videos_dir, { recursive: true });
    }
    const date = Date.now();
    const video_name = `${date}.mp4`;
    const video_path = path.join(videos_dir, video_name);
    await fs.promises.writeFile(video_path, video_buffer);

    const data = JSON.parse(json_data);
    console.log("video successfully saved", data);
    const dat_fake = {
      camera_ip: "10:190:18:40",
      date: {
        day: "saturday",
        time: "00:21:34",
      },
      alert_validity: "TP",
    };
    //get
    const shift = date_to_shift_convertor(data.date);
    const camera_ip = data.camera_ip.trim();

    //getshiftid
    const shift_id = await get_shift_id(shift);
    if (shift_id === "err") {
      console.log("error in controller office.js, loading shift id");
      return;
    }
    if (!shift_id) {
      console.log("error in controller office.js, couldn't find shift by id");
      return;
    }

    //getcameraid
    const camera_id = await get_camera_id(camera_ip);
    if (camera_id === "err") {
      console.log("error in controller office.js, loading shift id");
      return;
    }
    if (!camera_id) {
      console.log("error in controller office.js, couldn't find shift by id");
      return;
    }

    //getlocations
    const location_id = await get_locations_id(camera_id);
    if (location_id === "err") {
      console.log("error in controller office.js, loading shift id");
      return;
    }
    if (!location_id) {
      console.log("error in controller office.js, couldn't find shift by id");
      return;
    }

    // from user_location_shift get user id where location_id and shift_id
    const users_id = await get_users_id(location_id, shift_id);
    if (!users_id) {
      console.log("error in controller office.js, error occured in get_user_id function inside model");
      return;
    }

    const location_name = await get_location_name(location_id);
    if (!location_name) {
      console.log("error in controller office.js, error occured in get-location-name function inside model");
      return;
    }

    //if alert validty is tp send it to all deployed ground personnel
    const alert_validity = data.alert_validity;
    if (alert_validity === "TP" || alert_validity === "FN") {
      for (let user_id of users_id) {
        const socket_id = req.app.io.session_map[user_id];
        const message = { name: video_name, locations: location_name, camera_id };
        if (socket_id) {
          req.app.io.to(socket_id).emit("receive_video", message);
        }
      }
    }
    //date, camera_id, alert_validity, video_path
    save_alert_log({ date, camera_id, alert_validity, video_path });

    return res.status(200).json({ success: true, message: "got your video" });
  } else {
    return res.status(401).json({ success: false, message: `couldn't find video_blob and json_data` });
  }
};

module.exports = { download_video };
