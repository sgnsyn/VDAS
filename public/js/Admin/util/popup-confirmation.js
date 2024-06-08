let duration = 1750;

export function close_popup_conf(type = null) {
  let popup_duration = 0;
  type === "im" ? (popup_duration = 0) : (popup_duration = duration);
  return new Promise((resolve, reject) => {
    const popup_timer = setTimeout(() => {
      const popup_container = document.getElementById("confirmation-popup-backdrop");
      const confirm_btn = document.getElementById("confirm-confirmation-btn");
      const close_btn = document.getElementById("cancel-confirmation-btn");
      const message_p = document.getElementById("confirmation-popup-message");

      popup_container.classList.remove("active");
      popup_container.classList.add("deactive");
      popup_container.addEventListener(
        "animationend",
        (event) => popup_container.classList.add("disabled"),
        { once: true }
      );
      message_p.classList.remove("inform", "success", "error");
      confirm_btn.disabled = false;
      close_btn.disabled = false;

      clearTimeout(popup_timer);
      return resolve();
    }, popup_duration);
  });
}

export async function open_popup_conf(message, data = null) {
  return new Promise((resolve, reject) => {
    // get all the elements
    const popup_container = document.getElementById("confirmation-popup-backdrop");
    const confirm_btn = document.getElementById("confirm-confirmation-btn");
    const close_btn = document.getElementById("cancel-confirmation-btn");
    const message_p = document.getElementById("confirmation-popup-message");
    const data_div = document.getElementById("confirmation-popup-data");

    // reject if element is missing
    if (!popup_container || !confirm_btn || !close_btn || !message_p || !data_div)
      return reject("couldn't find some of the elements");

    // display data to the popup
    message_p.innerHTML = `${message}`;
    data_div.innerHTML = "";

    if (data) {
      for (let key of Object.keys(data)) {
        data_div.innerHTML += `
       <tr class="row">
            <td class="title">${key}:</td>
            <td class="value">
              ${data[key]}
            </td>
          </tr>`;
      }
    }

    // make popup visable
    popup_container.classList.remove("deactive");
    popup_container.classList.remove("disabled");
    popup_container.classList.add("active");

    // listien for confirm and cancel button
    confirm_btn.addEventListener(
      "click",
      () => {
        close_btn.disabled = true;
        confirm_btn.disabled = true;
        return resolve(true);
      },
      { once: true }
    );

    close_btn.addEventListener(
      "click",
      () => {
        return resolve(false);
      },
      { once: true }
    );
  });
}

export function handle_spinner(action) {
  const spinner = document.getElementById("spinner-icon");
  if (action === "start") {
    spinner.classList.remove("disabled");
    spinner.classList.add("spin");
  } else {
    spinner.classList.add("disabled");
    spinner.classList.remove("spin");
  }
}

export function set_conf_message(message, type = "inform") {
  const message_p = document.getElementById("confirmation-popup-message");
  message_p.innerHTML = message;
  message_p.classList.remove("inform", "success", "error");
  message_p.classList.add(type);
}

export async function display_confirmation_popup(data, message) {
  return new Promise(async (resolve, reject) => {
    const result = await open_popup_conf(message, data).catch((err) => {
      {
        console.log(err);
        return reject(err);
      }
    });

    if (!result) {
      return resolve(false);
    }
    return resolve(true);
  });
}
