import { popup_handler } from "../util/popup-menu.js";

const body_div = document.querySelector(".body-continaer");

let failure_log = {};

function display_element(failure_log) {
  for (let id of Object.keys(failure_log)) {
    const status = failure_log[id].status;
    if (!(status && status === "resolved")) {
      continue;
    }

    const element = create_element(failure_log, id);
    body_div.innerHTML += element;
  }
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

window.addEventListener("load", window_load_handler);
