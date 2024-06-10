import {
  close_popup_conf,
  handle_spinner,
  display_confirmation_popup,
  set_conf_message,
} from "../util/popup-confirmation.js";
import { popup_handler } from "../util/popup-menu.js";

/********************************** ELEMENTS **********************************/
const form = document.getElementById("form");

const role_select = document.getElementById("role-select");
const col2_div = document.querySelector(".col-2");
const loc_div = document.querySelector(".locations-container");

const weekend_shift_btn = document.querySelectorAll(".weekend-shift-btn");
const weekend_shift_radios = document.querySelectorAll(".weekend-schedule-radio");
const selected_location_div = document.querySelectorAll(".selected-location-container");

const weekend_schedule_div = document.querySelectorAll(".weekend-schedule");
const weekend_shedule_radio = document.querySelectorAll(".weekend-schedule-radio");
const error_inp = document.getElementById("error-inp");
const error_p = document.getElementById("error-p");

const auto_com_container = document.querySelector(".autocomplete-contianer");
const search_inp = document.querySelector(".search-inp");
const location_select = document.getElementById("location-select");
const week_location_div = document.querySelectorAll(".selected-location-container");

const locations = [];
const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

/********************************** FUNCTIONS **********************************/
async function form_handler(event) {
  event.preventDefault();
  const { first_name, middle_name, last_name, user_name, password, confirm_password, role } = form;
  // get values of input fields
  let first_name_v = first_name.value;
  let middle_name_v = middle_name.value;
  let last_name_v = last_name.value;
  let username_v = user_name.value;
  let password_v = password.value;
  let confirm_password_v = confirm_password.value;
  let role_v = role.value;

  //prepare object for shifts and initialize body
  let op_shift = {};
  let gp_shift = {};
  let body = {
    first_name: first_name_v,
    middle_name: middle_name_v,
    last_name: last_name_v,
    username: username_v,
    password: password_v,
    confirm_password: confirm_password_v,
    role: role_v,
  };

  //check if passwords match
  if (password_v !== confirm_password_v) {
    error_p.textContent = "Passwords should match.";
    error_inp.focus();
    return;
  }

  //prepare shifts for office personnel
  if (role_v === "op") {
    for (let day of weekdays) {
      let shift = get_shift_from_day(day);
      op_shift[`${day}`] = shift;
    }
    let bool = true;
    for (let keys of Object.keys(op_shift)) {
      if (op_shift[keys]) {
        bool = false;
      }
    }
    if (bool) {
      error_p.textContent = "Assign at least one shift.";
      error_inp.focus();
      return;
    }

    body["shift"] = op_shift;
  }

  //prepare shifts for ground
  if (role_v === "gp") {
    let bool = true;
    for (let day of weekdays) {
      //get shift and location
      let shift = get_shift_from_day(day);
      let location = get_locations_from_day(day);
      gp_shift[`${day}`] = { shift, location };

      // if at least one shift is selected, this has to do with the if condition out side the for block
      if (shift) bool = false;

      if (!shift && !location) {
        error_p.textContent =
          "Location cannot be assigned without selecting shift, Please check your locations and shifts.";
        error_inp.focus();
        return;
      }

      if (shift && location.length == 0) {
        error_p.textContent = `No locations was assigned for ${day} shift.`;
        error_inp.focus();
        return;
      }
    }

    // if not shift is selected
    if (bool) {
      error_p.textContent = "Assign at least one shift.";
      error_inp.focus();
      return;
    }

    body["shift"] = gp_shift;
  }

  const data_displayed = prepare_data_displayed(body);
  const confirmation_message = `Are you sure you want to create new user?`;
  const confirmation = await display_confirmation_popup(data_displayed, confirmation_message);

  // if cancel is clicked close confirm popup
  if (!confirmation) {
    close_popup_conf("im");
    return;
  }

  // if confirm is clicked start loading animation, try to save to db, get operation result,  stop loading aniation
  handle_spinner("start");
  const result = await send_data("/users", body);
  if (result === "err") {
    handle_spinner("stop");
    set_conf_message("Couldn't send the data, try again reloading the site.", "error");
    close_popup_conf();
    return;
  }
  handle_spinner("stop");
  const result_data = await result.json();

  // if operation is successfull display success message, clear form field and close confirmation popup
  if (result_data.success) {
    set_conf_message(result_data.message, "success");
    await close_popup_conf();
    window.location.href = "/users/add";
  }
  // if operation is not successfull display erro message,  and close confirmation popup
  if (!result_data.success) {
    set_conf_message(result_data.message, "error");
    close_popup_conf();
  }
}

function role_select_handler() {
  const role = role_select.value;
  //remove highlight and selected attribute from all shift buttons and schedule div
  weekend_shift_btn.forEach((btn) => {
    btn.removeAttribute("highlight");
    btn.removeAttribute("selected");
  });
  weekend_schedule_div.forEach((div) => {
    div.classList.add("disabled");
  });
  selected_location_div.forEach((div) => {
    div.classList.add("disabled");
  });
  document.querySelector(".monday-schedule").classList.remove("disabled");
  document.getElementById("monday-shift-btn").setAttribute("selected", "");
  document.querySelector(".selected-location-container-monday").classList.remove("disabled");

  // unselect all schedule
  weekend_shift_radios.forEach((radio) => {
    radio.removeAttribute("selected");
  });
  //remove all selected locations
  selected_location_div.forEach((div) => {
    div.innerHTML = "";
  });

  switch (role) {
    case "a":
      col2_div.classList.add("disabled");
      break;
    case "op":
      col2_div.classList.remove("disabled");
      loc_div.classList.add("disabled");
      break;
    case "gp":
      col2_div.classList.remove("disabled");
      loc_div.classList.remove("disabled");

      break;
  }
}

function weekend_shift_btn_handler(event) {
  // get the button, the data-day attribute and the schedule btns
  const btn = event.target;
  const day = btn.getAttribute("data-day");

  // get selected day and check if highlighted and if so check if location is selected for it
  const selected_btn = document.querySelector(`.weekend-shift-btn[selected]`);
  const selected_day = selected_btn.getAttribute("data-day");
  const selected_day_loc_div = document.querySelector(
    `.selected-location-container[data-day = '${selected_day}']`
  );
  const highlighted = selected_btn.hasAttribute("highlight");
  const role = form.role.value === "gp";

  if (!selected_day_loc_div.firstElementChild && highlighted && role) {
    error_p.textContent = "Select at least one location for the selected shift.";
    error_inp.focus();
    return;
  }

  // remove selected from all button and set it to the current one
  weekend_shift_btn.forEach((btn) => btn.removeAttribute("selected"));
  btn.setAttribute("selected", "");

  weekend_shift_btn.forEach((btn) => btn.removeAttribute("focus"));
  event.target.setAttribute("focus", "");

  // disable all other location and schedule and display one that belongs to the day
  weekend_schedule_div.forEach((div) => div.classList.add("disabled"));
  const schedule_div = document.querySelector(`.weekend-schedule[data-day="${day}"]`);
  schedule_div.classList.remove("disabled");

  week_location_div.forEach((div) => div.classList.add("disabled"));
  const location_div = document.querySelector(`.selected-location-container[data-day='${day}'`);
  location_div.classList.remove("disabled");
}

function schedule_shift_btn_handler(event) {
  const btn = event.target;
  const name = btn.getAttribute("name");
  const day = btn.getAttribute("data-day");

  const group_btn = document.querySelectorAll(`button[name = '${name}']`);
  const week_day_btn = document.querySelector(`.weekend-shift-btn[data-day="${day}"]`);
  const location_container = document.querySelector(`.selected-location-container[data-day="${day}"]`);

  if (btn.hasAttribute("selected")) {
    btn.removeAttribute("selected");
    group_btn.forEach((btn) => btn.removeAttribute("selected"));
    week_day_btn.removeAttribute("highlight");
    location_container.innerHTML = "";
    return;
  }

  group_btn.forEach((btn) => btn.removeAttribute("selected"));
  toggelAttribute(btn, "selected");
  week_day_btn.setAttribute("highlight", "");
}

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
  const week_day_btn = document.querySelector(".weekend-shift-btn[selected]");
  if (!week_day_btn.hasAttribute("highlight")) {
    error_p.textContent = "Select time shift first.";
    error_inp.focus();
    return;
  }

  const day = week_day_btn.getAttribute("data-day");
  const locations_div = document.querySelector(`.selected-location-container[data-day='${day}']`);

  //if location is already added, inform that it is
  let location_exist = false;
  const add_locations = document.querySelectorAll(".selected-location");
  for (let loc of add_locations) {
    let loc_name = loc.getAttribute("data-name");
    let loc_day = loc.getAttribute("data-day");

    if (text === loc_name && day === loc_day) {
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
  const div = create_select_loc_element(text, day);
  locations_div.append(div);

  // add event listenr to the delete button to remove
  const btn = document.getElementById(`btn-${text}-${day}`);
  btn.addEventListener("click", delete_loc_btn_handler);
}

function delete_loc_btn_handler(event) {
  const btn = event.target;

  const text = btn.getAttribute("data-name");
  const day = btn.getAttribute("data-day");

  const delete_loc_div = document.querySelector(`.selected-location[data-name='${text}'][data-day='${day}']`);

  delete_loc_div.innerHTML = "";
  delete_loc_div.remove();
}

function create_select_loc_element(text, day) {
  const div = document.createElement("div");
  const span = document.createElement("span");
  const button = document.createElement("button");
  const img = document.createElement("img");

  img.src = `/Assets/Icons/thrash.svg`;
  img.alt = `close-small`;

  button.type = "button";
  button.classList.add("btn", "delete-selected-location-btn");
  button.setAttribute("data-name", text);
  button.setAttribute("data-day", day);
  button.setAttribute("id", `btn-${text}-${day}`);
  button.append(img);

  span.textContent = text;

  div.classList.add("selected-location");
  div.setAttribute("data-name", text);
  div.setAttribute("data-day", day);

  div.append(span, button);

  return div;
}

function set_location_select() {
  for (let loc of locations) {
    location_select.innerHTML += `<option value="${loc}">${loc}</option>`;
  }
}

async function send_data(route, body) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  let result;
  await fetch(route, options)
    .then((data) => {
      result = data;
    })
    .catch((err) => {
      result = "err";
    });
  return result;
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
async function window_load_handler() {
  await load_location();
  set_location_select();
  popup_handler();
}

/********************************** EVENT LISTENERS **********************************/
role_select.addEventListener("change", role_select_handler);
search_inp.addEventListener("input", search_handler);
location_select.addEventListener("change", auto_com_btn_handler);
search_inp.addEventListener("focus", search_handler);

form.addEventListener("submit", form_handler);

weekend_shift_btn.forEach((btn) => {
  btn.addEventListener("click", weekend_shift_btn_handler);
});
weekend_shedule_radio.forEach((btn) => {
  btn.addEventListener("click", schedule_shift_btn_handler);
});
error_inp.addEventListener("blur", () => {
  error_p.textContent = "";
});
window.addEventListener("load", window_load_handler);

/********************************** UTILITY FUNCTIONS **********************************/
function toggelAttribute(elt, atr) {
  if (elt.hasAttribute(atr)) {
    elt.removeAttribute(atr);
    return;
  }

  elt.setAttribute(atr, "");
}

function get_shift_from_day(day) {
  const radios = document.querySelectorAll(`.weekend-schedule-radio[name = '${day}-schedule']`);
  let schedule = null;
  for (let radio of radios) {
    if (radio.hasAttribute("selected")) {
      schedule = radio.getAttribute("data-value");
      break;
    }
  }
  return schedule;
}
function get_locations_from_day(day) {
  const locations_arr = [];
  const location_container = document.querySelector(`.selected-location-container-${day}`);
  const locations = location_container.childNodes;
  for (let location of locations) {
    locations_arr.push(location.outerText);
  }
  return locations_arr;
}
function prepare_data_displayed(body) {
  let role = body.role == "a" ? "Admin" : body.role == "gp" ? "Ground personnel" : "Office personnel";
  return {
    "first name": body.first_name,
    "middle name": body.middle_name,
    "last name": body.last_name,
    username: body.username,
    role,
  };
}
function isArrayNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}
