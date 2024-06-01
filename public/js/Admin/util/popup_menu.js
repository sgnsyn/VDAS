export function popup_handler() {
  const open_popup_btn = document.getElementById("open-logout-popup-btn");
  const close_popup_btn = document.getElementById("close-logout-popup-btn");
  const popup_container = document.getElementById("menu-popup-container");

  function close_popup() {
    popup_container.classList.remove("active");
    popup_container.classList.add("deactive");
    popup_container.addEventListener(
      "animationend",
      (event) => popup_container.classList.add("disabled"),
      { once: true }
    );
  }
  function open_popup() {
    popup_container.classList.remove("deactive");
    popup_container.classList.remove("disabled");
    popup_container.classList.add("active");
  }

  open_popup_btn.addEventListener("click", open_popup);
  close_popup_btn.addEventListener("click", close_popup);
}
