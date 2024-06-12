import {
  close_popup_conf,
  handle_spinner,
  display_confirmation_popup,
  set_conf_message,
} from "../util/popup-confirmation.js";
import { popup_handler } from "../util/popup-menu.js";

const locations = [];
const location_select = document.getElementById("location-select");
const form = document.getElementById("add-cctv-form");
const search_inp = document.querySelector(".search-inp");
const auto_com_container = document.querySelector(".autocomplete-contianer");

const error_inp = document.getElementById("error-inp");
const error_p = document.getElementById("error-p");
const locations_div = document.querySelector(".selected-location-container");

function prepare_data() {
  const camera_ip = form.camera.value.trim();
  const locations = get_locations();
  return {
    data_dispayed: { "CCTV IP": camera_ip },
    data_sent: { camera_ip, locations },
  };
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

async function form_handler(event) {
  event.preventDefault();

  //  prepare data and confirmation message
  const { data_dispayed, data_sent } = prepare_data();
  const { locations, camera_ip } = data_sent;

  if (!is_valid_ipv4(camera_ip)) {
    error_p.textContent = "IP is not valid. Provide valid Ip.";
    error_inp.focus();
    return;
  }
  console.log(data_sent);
  if (locations.length <= 0) {
    error_p.textContent = "No location is added. Add at least one location.";
    error_inp.focus();
    return;
  }

  const confirmation_message = `Are you sure you want to add the cctv?`;
  const confirmation = await display_confirmation_popup(data_dispayed, confirmation_message);

  // if cancel is clicked close confirm popup
  if (!confirmation) {
    close_popup_conf("im");
    return;
  }

  // if confirm is clicked start loading animation, try to save to db, get operation result,  stop loading aniation
  handle_spinner("start");
  const result = await send_data("/cctv/add", data_sent);
  handle_spinner("stop");
  const result_data = await result.json();

  // if operation is successfull display success message, clear form field and close confirmation popup
  if (result_data.success) {
    set_conf_message(result_data.message, "success");
    form.reset();
    document.querySelector(`.selected-location-container`).innerHTML = "";
    close_popup_conf();
  }
  // if operation is not successfull display erro message,  and close confirmation popup
  if (!result_data.success) {
    set_conf_message(result_data.message, "error");
    close_popup_conf();
  }
}

async function load_location() {
  const result = await fetch("/locations");
  const data = await result.json();
  if (data.success) {
    if (isArrayNotEmpty(data.result)) {
      for (let element of data.result) {
        locations.push(element.name);
      }
    }
  }
}
function set_location_select() {
  for (let loc of locations) {
    location_select.innerHTML += `<option value="${loc}">${loc}</option>`;
  }
}
// locations add
function search_handler(event) {
  //get the value being inputed
  const keyword = search_inp.value;

  //if input value is empty return set tr to active
  auto_com_container.innerHTML = "";
  if (keyword === "") {
    auto_com_container.classList.add("disabled");
    return;
  }

  // only display loction that includes keyword
  auto_com_container.classList.remove("disabled");
  let match_counter = 0;
  for (let elt of locations) {
    if (elt.toLowerCase().includes(keyword.trim().toLowerCase())) {
      auto_com_container.innerHTML += `<button type="button" class="btn"><p>${elt}</p></button>`;
      match_counter++;
    }
  }
  if (match_counter === 0) auto_com_container.classList.add("disabled");

  // add event listener to aucto complete btn
  const auto_com_btn = document.querySelectorAll(".autocomplete-contianer .btn");
  auto_com_btn.forEach((btn) => btn.addEventListener("click", auto_com_btn_handler));
}

function auto_com_btn_handler(event) {
  let text;
  const elt = event.target;

  // select the text from different place based on what triggered the event
  if (event.target.tagName === "BUTTON" || event.target.tagName === "P") {
    text = elt.innerText;
  }
  if (event.target.tagName === "SELECT") {
    text = elt.value;
  }

  // disable autocomplete div and reset search inp and select
  auto_com_container.classList.add("disabled");
  location_select.value = "null";
  search_inp.value = "";

  //if shift is not selected display to select shift first

  //if location is already added, inform that it is
  let location_exist = false;
  const add_locations = document.querySelectorAll(".selected-location");
  for (let loc of add_locations) {
    let loc_name = loc.getAttribute("data-name");

    if (text === loc_name) {
      location_exist = true;
      break;
    }
  }
  if (location_exist) {
    error_p.textContent = "Location is already added.";
    error_inp.focus();

    return;
  }

  // create new location div and add it to locations_div
  const div = create_select_loc_element(text);
  locations_div.append(div);

  // add event listenr to the delete button to remove
  const btn = document.getElementById(`btn-${text}`);
  btn.addEventListener("click", delete_loc_btn_handler);
}

async function window_load_handler() {
  await load_location();
  set_location_select();
  popup_handler();
}

form.addEventListener("submit", form_handler);
window.addEventListener("load", window_load_handler);
search_inp.addEventListener("input", search_handler);
search_inp.addEventListener("focus", search_handler);
location_select.addEventListener("change", auto_com_btn_handler);

error_inp.addEventListener("blur", () => {
  error_p.textContent = "";
});

// UTILTY FUNCTION
function isArrayNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}
function create_select_loc_element(text) {
  const div = document.createElement("div");
  const span = document.createElement("span");
  const button = document.createElement("button");
  const img = document.createElement("img");

  img.src = `/Assets/Icons/thrash.svg`;
  img.alt = `close-small`;
  img.style = "pointer-events: none";

  button.type = "button";
  button.classList.add("btn", "delete-selected-location-btn");
  button.setAttribute("data-name", text);

  button.setAttribute("id", `btn-${text}`);
  button.append(img);

  span.textContent = text;

  div.classList.add("selected-location");
  div.setAttribute("data-name", text);

  div.append(span, button);

  return div;
}
function delete_loc_btn_handler(event) {
  const btn = event.target;

  const text = btn.getAttribute("data-name");

  const delete_loc_div = document.querySelector(`.selected-location[data-name='${text}']`);

  delete_loc_div.innerHTML = "";
  delete_loc_div.remove();
}

function get_locations() {
  const locations_arr = [];
  const location_container = document.querySelector(`.selected-location-container`);
  const locations = location_container.childNodes;
  for (let location of locations) {
    locations_arr.push(location.outerText);
  }
  return locations_arr;
}
function is_valid_ipv4(ip) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
  return ipv4Regex.test(ip);
}
