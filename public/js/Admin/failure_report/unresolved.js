import { popup_handler } from "../util/popup-menu.js";

const body_div = document.querySelector(".body-continaer");

let failure_log = {};

function display_element(failure_log) {
  for (let id of Object.keys(failure_log)) {
    const status = failure_log[id].status;
    if (!(status && status === "unresolved")) {
      continue;
    }

    const element = create_element(failure_log, id);
    body_div.innerHTML += element;
  }
  const resolve_btn = document.querySelectorAll(".mark-resolved-btn");
  resolve_btn.forEach((btn) => {
    btn.addEventListener("click", resolve_handler);
  });
}

function create_element(failure_log, id) {
  return `
        <div class="resolve-continaer" data-id= "${id}">
          <div class="title-value-container">
            <p class="title">date:</p>
            <p class="value">${failure_log[id].date}</p>
          </div>

          <div class="title-value-container">
            <p class="title">reported by:</p>
            <p class="value">${failure_log[id].reported_by}</p>
          </div>

          <div class="title-value-container">
            <p class="title">description:</p>
            <p class="value">
             ${failure_log[id].description}
            </p>
          </div>
          <button class="btn mark-resolved-btn" data-id = "${id}">Mark Resolved</button>
        </div>`;
}

async function window_load_handler() {
  popup_handler();
  failure_log = await load_reports();
  display_element(failure_log);
}

async function load_reports() {
  const response = await fetch("/reports/reports");
  return response.json();
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

async function resolve_handler(event) {
  const btn = event.target;
  const id = btn.getAttribute("data-id");
  const div = document.querySelector(`.resolve-continaer[data-id = "${id}"]`);
  //send to back end and if delete remove the div
  const response = await send_data("/reports/update", { id });
  const result = await response.json();
  if (result.success) {
    div.remove();
  } else {
    alert(result.message);
  }
}
window.addEventListener("load", window_load_handler);
