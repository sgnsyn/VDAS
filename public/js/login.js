const form = document.getElementById("login-form");
const erro_p = document.getElementById("error-p");
const inputs = document.querySelectorAll(".inp");

async function send_credential(route, body) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return fetch(route, options);
}

function validateCredentials(username, password) {
  return true;
}

async function load_dashboard() {}

async function form_submit_handler(e) {
  e.preventDefault();

  const username = form.username.value;
  const password = form.password.value;

  if (!validateCredentials(username, password)) {
    alert("make it valid");
    return;
  }

  const result = await send_credential("/login/auth", { username, password });
  const data = await result.json();

  console.log(data);

  if (data.success) {
    erro_p.innerHTML = `&nbsp;`;
    window.location.href = data.path;
    return;
  }

  if (!data.success) {
    erro_p.innerHTML = data.message;
    return;
  }
}

form.addEventListener("submit", form_submit_handler);
inputs.forEach((input) =>
  input.addEventListener("input", () => (erro_p.innerHTML = `&nbsp;`))
);
