const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { json } = require("body-parser");

const download_video = async (req, res) => {
  const { json_data, video_blob } = req.body;
  if (video_blob && json_data) {
    const videoBuffer = Buffer.from(video_blob, "base64");

    const videosDir = path.join(__dirname, "../../../videos");
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }
    const videoPath = path.join(videosDir, `${Date.now()}.mp4`);
    await fs.promises.writeFile(videoPath, videoBuffer);

    const data = JSON.parse(json_data);
    console.log("video successfully saved");
    if (data.alert_validity === "TP") {
      // get client id
    }
    return res.status(200).json({ success: true, message: "got your video" });
  } else {
    return res.status(401).json({ success: false, message: `couldn't find video_blob and json_data` });
  }
};
const get_video = async (req, res) => {
  return res.status(200).json({ success: true, message: "great" });
};
module.exports = { download_video, get_video };
