import { popup_handler } from "./util/popup-menu.js";
window.addEventListener("load", () => {
  onload();
  popup_handler();
  local_storage_handler();
});

const interval_timeout = 10000;

const video_element = document.getElementById("video-player");
const video_div = document.querySelector(".alert-container");
const alert_div = document.querySelector(".alert-title-container");
const no_alert_div = document.querySelector(".no-alert-title-container");
const more_btn = document.getElementById("more-detail-btn");

const time_ellapsed_p = document.querySelector(".time-ellapsed");
const timer_p = document.getElementById("timer-p");
const locations_div = document.getElementById("locations-container");
const camera_span = document.getElementById("camera-id");
const error_inp = document.getElementById("err-inp");
const resolve_btn = document.querySelector(".resolve-btn");

const audio = document.createElement("audio");
audio.loop = "loop";
audio.src = `/Assets/sound/alert.mp3`;

let source;

async function onload() {
  const result = await fetch("/ground_personnel/id");
  const data = await result.json();
  const user_id = data.id;

  const socket = io();

  socket.on("request_id", () => {
    socket.emit("get_id", user_id);
  });

  socket.on("receive_video", async (message) => {
    const path = message.name;
    const locations = message.locations;
    const camera_id = message.camera_id;
    let timer = 1;

    window.localStorage.setItem("path", path);
    window.localStorage.setItem("locations", locations);
    window.localStorage.setItem("camera_id", camera_id);
    window.localStorage.setItem("resolved", "0");
    window.localStorage.setItem("timer", timer);

    camera_span.innerHTML = camera_id;
    for (let loc of locations) {
      locations_div.innerHTML += `<p class="info_value">${loc}</p>`;
    }
    timer_p.innerHTML = "Just now.";
    time_ellapsed_p.innerHTML = "Just now.";

    const timeout = setInterval(() => {
      timer++;
      window.localStorage.setItem("timer", timer);
    }, 1000);
    const interval = setInterval(() => {
      if (timer < 60) {
        timer_p.innerHTML = `${timer} ${timer > 1 ? "seconds" : "second"} ago.`;
        time_ellapsed_p.innerHTML = `${timer} seconds ago.`;
      }
      if (timer >= 60) {
        let minutes = Math.floor(timer / 60);
        timer_p.innerHTML = `${minutes} minutes ago.`;
        time_ellapsed_p.innerHTML = `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago.`;
      }
    }, interval_timeout);

    const response = await send_data("/ground_personnel/video", { path });
    const blob = await response.blob();

    const video_url = URL.createObjectURL(blob);

    source = document.createElement("source");
    source.src = video_url;
    source.type = "video/mp4";
    // handle disabel

    audio.play();
    error_inp.focus();

    video_div.classList.add("disabled");
    alert_div.classList.remove("disabled");
    no_alert_div.classList.add("disabled");
    more_btn.addEventListener("click", more_btn_handler);
  });
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

function more_btn_handler() {
  video_element.append(source);
  video_element.playbackRate = 0.2;
  video_div.classList.remove("disabled");
  alert_div.classList.add("disabled");
  no_alert_div.classList.add("disabled");
}

function inp_blur_handler() {
  audio.pause();
  audio.currentTime = 0;
}

async function local_storage_handler() {
  const path = window.localStorage.getItem("path");
  const locations_str = window.localStorage.getItem("locations");
  const camera_id = window.localStorage.getItem("camera_id");
  const resolved = window.localStorage.getItem("resolved");
  let timer = window.localStorage.getItem("timer");

  timer = Number(timer);

  const locations = locations_str.split(",");

  if (resolved === "1") {
    return;
  }
  // set element items
  camera_span.innerHTML = camera_id;
  for (let loc of locations) {
    locations_div.innerHTML += `<p class="info_value">${loc}</p>`;
  }

  const timer_str =
    timer < 10
      ? "Just now."
      : timer < 60
      ? `${timer} seconds ago.`
      : `${Math.floor(timer / 60)} ${timer / 60 > 1 ? "minutes" : "minute"} ago.`;
  timer_p.innerHTML = timer_str;
  time_ellapsed_p.innerHTML = timer_str;

  const timeout = setInterval(() => {
    timer++;
    window.localStorage.setItem("timer", timer);
  }, 1000);
  const interval = setInterval(() => {
    if (timer < 60) {
      timer_p.innerHTML = `${timer} ${timer > 1 ? "seconds" : "second"} ago.`;
      time_ellapsed_p.innerHTML = `${timer} seconds ago.`;
    }
    if (timer >= 60) {
      let minutes = Math.floor(timer / 60);
      timer_p.innerHTML = `${minutes} minutes ago.`;
      time_ellapsed_p.innerHTML = `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago.`;
    }
  }, interval_timeout);

  // add video
  const response = await send_data("/ground_personnel/video", { path });
  const blob = await response.blob();
  const video_url = URL.createObjectURL(blob);

  source = document.createElement("source");
  source.src = video_url;
  source.type = "video/mp4";

  //make divs appear and disappear
  video_div.classList.add("disabled");
  alert_div.classList.remove("disabled");
  no_alert_div.classList.add("disabled");
  more_btn.addEventListener("click", more_btn_handler);
}

function resolve_handler() {
  window.localStorage.setItem("resolved", "1");
  window.location.href = "/ground_personnel/dashboard";
}

error_inp.addEventListener("blur", inp_blur_handler);
resolve_btn.addEventListener("click", resolve_handler);
