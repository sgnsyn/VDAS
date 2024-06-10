const path = require("path");

//@desc get login.html
//@route GET /dashboard
//@access private
const get_dashboard_page = async (req, res) => {
  res.render("ground_personnel/dashboard", {
    role: req.session.user.role,
    username: req.session.user.username,
  });
};
//@desc get login.html
//@route GET /feedbck
//@access private
const get_feedback_page = async (req, res) => {
  res.sendFile(path.join(__dirname, "../../views/ground_personnel", "feedback.html"));
};

const get_id = async (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ id: req.session.user.id });
  }
};
const get_video = async (req, res) => {
  const video_name = req.body.path;
  const video_dir = path.join(__dirname, "../../../Videos", video_name);

  res.sendFile(video_dir);
};

module.exports = { get_feedback_page, get_dashboard_page, get_id, get_video };
