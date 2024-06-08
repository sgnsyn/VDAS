import {
  close_popup_conf,
  handle_spinner,
  display_confirmation_popup,
  set_conf_message,
} from "../util/popup-confirmation.js";
import { popup_handler } from "../util/popup-menu.js";

const form = document.getElementById("add-location-form");

function prepare_data() {
  const location_name = form.name.value;
  const location_desc = form.description.value;
  return {
    data_dispayed: { "location name": location_name, description: location_desc },
    data_sent: { location_name, location_desc },
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
  const confirmation_message = `Are you sure you want to add the location?`;
  const confirmation = await display_confirmation_popup(data_dispayed, confirmation_message);

  // if cancel is clicked close confirm popup
  if (!confirmation) {
    close_popup_conf("im");
    return;
  }

  // if confirm is clicked start loading animation, try to save to db, get operation result,  stop loading aniation
  handle_spinner("start");
  const result = await send_data("/locations/add", data_sent);
  handle_spinner("stop");
  const result_data = await result.json();

  // if operation is successfull display success message, clear form field and close confirmation popup
  if (result_data.success) {
    set_conf_message(result_data.message, "success");
    form.reset();
    close_popup_conf();
  }
  // if operation is not successfull display erro message,  and close confirmation popup
  if (!result_data.success) {
    set_conf_message(result_data.message, "error");
    close_popup_conf();
  }
}

form.addEventListener("submit", form_handler);
window.addEventListener("load", () => {
  popup_handler();
});
