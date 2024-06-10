import { popup_handler } from "../util/popup-menu.js";

let alert_log;
const routes_contianer = document.querySelector(".routes-container");
const video_element = document.querySelector(".video-container");
const more_value_date_p = document.querySelector(".more-value-date");
const more_value_id_p = document.querySelector(".more-value-id");
const more_value_validity_p = document.querySelector(".more-value-validity");
const close_more_btn = document.getElementById("btn-close-info");
const more_backdrop = document.querySelector(".more-info-backdrop");

function display_alert(alert_log) {
  for (let key of Object.keys(alert_log)) {
    const element_str = create_element(alert_log[key], key);
    routes_contianer.innerHTML += element_str;
  }

  const more_btn = document.querySelectorAll(".more-btn");
  more_btn.forEach((btn) => {
    btn.addEventListener("click", more_btn_handler);
  });
}

async function more_btn_handler(event) {
  const btn = event.target;
  const data_id = btn.getAttribute("data-id");
  console.log(data_id);
  if (!data_id) {
    return;
  }
  console.log(alert_log, "alertlog");

  const path = alert_log[data_id].filename;

  const response = await send_data("/ground_personnel/video", { path });
  const blob = await response.blob();
  const video_url = URL.createObjectURL(blob);

  const video = document.createElement("video");
  video.width = 320;
  video.height = 240;
  video.controls = "controls";

  const source = document.createElement("source");
  source.src = video_url;
  source.type = "video/mp4";

  video.append(source);
  video.playbackRate = 0.2;

  video_element.innerHTML = "";
  video_element.append(video);

  more_value_date_p.innerHTML = alert_log[data_id].date;
  more_value_id_p.innerHTML = alert_log[data_id].camera_id;
  more_value_validity_p.innerHTML = alert_log[data_id].validity;

  more_backdrop.classList.remove("disabled");
}

function create_element(data, key) {
  const { validity, camera_id, date } = data;
  return `
        <div class="btn grid-btn">
          <div>
            <div class="title-value-container">
              <p class="title">Date</p>
              <p class="value">${date}</p>
            </div>
            <div class="title-value-container">
              <p class="title">Camera ID</p>
              <p class="value">${camera_id}</p>
            </div>
            <div class="title-value-container">
              <p class="title">Validity</p>
              <p class="value">${validity}</p>
            </div>
          </div>
          <button class="btn more-btn" data-id = "${key}">more</button>
        </div>
          
          `;
}
async function send_data(route, body) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return fetch(route, options);
}
function close_handler() {
  more_backdrop.classList.add("disabled");
}

async function load_location() {
  const response = await fetch("/alert-logs/logs");
  const data = await response.json();
  return data;
}

close_more_btn.addEventListener("click", close_handler);
window.addEventListener("load", async () => {
  popup_handler();
  alert_log = await load_location();
  display_alert(alert_log);
});
