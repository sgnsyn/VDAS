import { popup_handler } from "../util/popup-menu.js";
import {
  close_popup_conf,
  handle_spinner,
  display_confirmation_popup,
  set_conf_message,
} from "../util/popup-confirmation.js";

const tabel = document.getElementById("data-list-container-tabel");
const search_inp = document.querySelector(".search-inp");
const search_contianer = document.querySelector(".search-inp-btn");

let locations = [];

/******************************************** FUNCTION  ***************************************/
async function load_users() {
  const result = await fetch("/users");
  const data = await result.json();
  if (data.success) {
    if (isArrayNotEmpty(data.result)) {
      set_table_data(data.result);
    } else {
      set_table_data(false);
    }
  }
}

async function request_delete(id, route) {
  const option = {
    method: "DELETE",
  };
  return fetch(`${route}/${encodeURIComponent(id)}`, option);
}
async function request_edit_page(id, route) {
  const option = {
    method: "GET",
  };
  return fetch(`${route}/${encodeURIComponent(id)}`, option);
}

function set_table_data(data) {
  //clear previous values from the table
  tabel.innerHTML = "";
  //check if there are no data, display no data, return
  const nodata = `<p class="inform-p">No Data Found</p>`;
  if (!data) {
    tabel.innerHTML = nodata;
    return;
  }
  search_contianer.classList.remove("disabled");

  //set the head or the table
  const thead = ` <thead>
  <tr>
    <td>Username</td>
    <td>Role</td>
  </tr>
</thead>
`;
  tabel.innerHTML = thead;

  // prepare the table rows using the data
  let trs = "";
  for (let element of data) {
    trs += `<tr data-name="${element.username}">
    <td id = "td_name">${element.username}</td>
    <td id = "td_desc">${element.role}</td>
    
    <td class="btn-container">
      <button class="btn delete-btn" data-name="${element.username}">delete</button>
    </td>
  </tr>`;
    locations.push(element.username);
  }

  // add table rows to the table body and put it in table
  const tbody = `<tbody>
  ${trs}
</tbody>`;
  tabel.innerHTML += tbody;

  //   get delete and edit btns and add event listeners
  const delete_btns = document.querySelectorAll(".delete-btn");
  const edit_btns = document.querySelectorAll(".edit-btn");

  delete_btns.forEach((btn) => btn.addEventListener("click", delete_handler));
  edit_btns.forEach((btn) => btn.addEventListener("click", edit_handler));

  //add event listener to search
  search_inp.addEventListener("input", search_handler);
}

function isArrayNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

async function delete_handler(event) {
  // get name attribute of btn that is triggered
  const btn = event.target;
  const name = btn.getAttribute("data-name");

  // get tr td and their text content
  const tr = document.querySelector(`tr[data-name='${name}']`);
  const td_name = tr.querySelector("#td_name");
  const td_desc = tr.querySelector("#td_desc");

  const username = td_name.textContent;
  const role = td_desc.textContent;

  // prepare data to be displayed on popup
  const data = { Username: username, role };
  const message = "Are you sure you want to delete this user";

  //open popup and if cancle is triggered close popup
  const result = await display_confirmation_popup(data, message);
  if (!result) {
    close_popup_conf("im");
    return;
  }

  //send data to back end and wait for result
  handle_spinner("start");
  const delete_result = await request_delete(name, "/users");
  handle_spinner("stop");
  const result_data = await delete_result.json();

  // if succesfully delete display succes message and remove the element from dom, else display error message
  if (result_data.success) {
    set_conf_message(result_data.message, "success");
    tr.remove();
    close_popup_conf();
  } else {
    set_conf_message(result_data.message, "error");
    close_popup_conf();
  }
}

function edit_handler(event) {
  const btn = event.target;
  const name = btn.getAttribute("data-name");
  request_edit_page(name, "/edit/users");
}

async function search_handler(event) {
  //get the value being inputed
  const search_inp = event.target;
  const keyword = search_inp.value;

  //if input value is empty return set tr to active
  const trs = document.querySelectorAll("tbody tr");
  if (keyword === "") {
    trs.forEach((tr) => tr.classList.remove("disabled"));
    return;
  }

  // only display loction that includes keyword
  trs.forEach((tr) => tr.classList.add("disabled"));
  for (let elt of locations) {
    if (elt.toLowerCase().includes(keyword.toLowerCase())) {
      trs.forEach((tr) => {
        if (tr.getAttribute("data-name").toLocaleLowerCase() === elt.toLocaleLowerCase()) {
          tr.classList.remove("disabled");
        }
      });
    }
  }

  // add event listener to aucto complete btn
  const auto_com_btn = document.querySelectorAll(".autocomplete-contianer .btn");
  auto_com_btn.forEach((btn) => btn.addEventListener("click", auto_com_btn_handler));
}

/******************************************** EVENT  ***************************************/

window.addEventListener("load", () => {
  load_users();
  popup_handler();
});
