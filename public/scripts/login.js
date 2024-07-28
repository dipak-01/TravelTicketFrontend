let btn = document.querySelector("#login");

btn.addEventListener("click", function () {
  let signupForm = document.querySelector(".sign-up-container");
  let signinForm = document.querySelector(".sign-in-container");

  signupForm.classList.add("down");
  signinForm.classList.add("up");
});

let btn2 = document.querySelector("#signup");

btn2.addEventListener("click", function () {
  let signupForm = document.querySelector(".sign-up-container");
  let signinForm = document.querySelector(".sign-in-container");

  signupForm.classList.remove("down");
  signinForm.classList.remove("up");
});

let loginForm = document.querySelector(".log-in");

loginForm.addEventListener("submit", handleSubmitLogin);

async function handleSubmitLogin(event) {
  event.preventDefault();
  let formData = new FormData(loginForm);
  let data = Object.fromEntries(formData);
  const response = await axios({
    method: "POST",
    url: "http://localhost:4000/api/user/login",
    data: data,
  });
  if (response.data.success) {
    alert(response.data.message);
    window.location.href = "http://127.0.0.1:5500/TravelTicketFrontend/";
  } else {
    alert(response.data.message);
  }
}

let registerForm = document.querySelector(".register");

registerForm.addEventListener("submit", handleSubmitRegister);

async function handleSubmitRegister(event) {
  event.preventDefault();
  let formData = new FormData(registerForm);
  let data = Object.fromEntries(formData);
  const response = await axios({
    method: "POST",
    url: "http://localhost:4000/api/user/register",
    data: data,
  });
  if (response.data.success) {
    alert(response.data.message);
    window.location.href = "http://127.0.0.1:5500/TravelTicketFrontend/";
  } else {
    alert(response.data.message);
  }
}
