// let btn = document.querySelector("#login");

// btn.addEventListener("click", function () {
//   let signupForm = document.querySelector(".sign-up-container");
//   let signinForm = document.querySelector(".sign-in-container");

//   signupForm.classList.add("down");
//   signinForm.classList.add("up");
// });

// let btn2 = document.querySelector("#signup");

// btn2.addEventListener("click", function () {
//   let signupForm = document.querySelector(".sign-up-container");
//   let signinForm = document.querySelector(".sign-in-container");

//   signupForm.classList.remove("down");
//   signinForm.classList.remove("up");
// });

// let loginForm = document.querySelector(".log-in");

// loginForm.addEventListener("submit", handleSubmitLogin);

// async function handleSubmitLogin(event) {
//   event.preventDefault();
//   let formData = new FormData(loginForm);
//   let data = Object.fromEntries(formData);
//   const response = await axios({
//     method: "POST",
//     url: "https://travel-ticket-backend.onrender.com/api/user/login",
//     data: data,
//   });
//   if (response.data.success) {
//     alert(response.data.message);
//     window.location.href = "http://127.0.0.1:5500/TravelTicketFrontend/";
//     const token = response.data.token;
//     Cookies.set("token", token, { expires: 1 });
//   } else {
//     alert(response.data.message);
//   }
// }

// let registerForm = document.querySelector(".register");

// registerForm.addEventListener("submit", handleSubmitRegister);

// async function handleSubmitRegister(event) {
//   event.preventDefault();
//   let formData = new FormData(registerForm);
//   let data = Object.fromEntries(formData);
//   const password = data.password;
//   const confirmPassword = data["confirm-password"];

//   if (password !== confirmPassword) {
//     alert("Passwords do not match");
//     return;
//   }

//   const response = await axios({
//     method: "POST",
//     url: "https://travel-ticket-backend.onrender.com/api/user/register",
//     data: data,
//   });
//   if (response.data.success) {
//     alert(response.data.message);
//     Cookies.set("token", response.data.token, { expires: 1 });
//     window.location.href = "http://127.0.0.1:5500/TravelTicketFrontend/";
//   } else {
//     alert(response.data.message);
//   }
// }

// function showSidebar() {
//   const sidebar = document.querySelector(".sidebar");
//   sidebar.classList.add("show");
//   const body = document.querySelector(".body");
//   body.style.overflow = "hidden";
// }

// function hideSidebar() {
//   const sidebar = document.querySelector(".sidebar");
//   sidebar.classList.remove("show");
//   const body = document.querySelector(".body");
//   body.style.overflow = "";
// }

// Get the forms and buttons
const loginForm = document.querySelector(".log-in");
const registerForm = document.querySelector(".register");
const btnLogin = document.querySelector("#login");
const btnSignup = document.querySelector("#signup");

// Toggle password visibility
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const input = document.getElementById(targetId);

    if (input.type === "password") {
      input.type = "text";
      this.src = "/TravelTicketFrontend/assets/eye-open.png";
    } else {
      input.type = "password";
      this.src = "/TravelTicketFrontend/assets/eye-close.png";
    }
  });
});

// Add event listeners
loginForm.addEventListener("submit", handleSubmitLogin);
registerForm.addEventListener("submit", handleSubmitRegister);
btnLogin.addEventListener("click", toggleForms);
btnSignup.addEventListener("click", toggleForms);

// Toggle forms function
function toggleForms() {
  const signupForm = document.querySelector(".sign-up-container");
  const signinForm = document.querySelector(".sign-in-container");

  if (signupForm.classList.contains("down")) {
    signupForm.classList.remove("down");
    signinForm.classList.remove("up");
  } else {
    signupForm.classList.add("down");
    signinForm.classList.add("up");
  }
}

// Handle login form submission
async function handleSubmitLogin(event) {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);
  const response = await axios({
    method: "POST",
    url: "https://travel-ticket-backend.onrender.com/api/user/login",
    data: data,
  });

  if (response.data.success) {
    alert(response.data.message);
    window.location.href = "/TravelTicketFrontend/index.html";
    const token = response.data.token;
    Cookies.set("token", token, { expires: 1 });
  } else {
    alert(response.data.message);
  }
}

// Handle register form submission
async function handleSubmitRegister(event) {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
  const password = data.password;
  const confirmPassword = data["confirm-password"];

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const response = await axios({
    method: "POST",
    url: "https://travel-ticket-backend.onrender.com/api/user/register",
    data: data,
  });

  if (response.data.success) {
    alert(response.data.message);
    Cookies.set("token", response.data.token, { expires: 1 });
    window.location.href = "/TravelTicketFrontend/index.html";
  } else {
    alert(response.data.message);
  }
}

// Show and hide sidebar functions
function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.add("show");
  const body = document.querySelector(".body");
  body.style.overflow = "hidden";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("show");
  const body = document.querySelector(".body");
  body.style.overflow = "";
}
