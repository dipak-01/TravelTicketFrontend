// Fetch token from cookies
const token = Cookies.get("token");

// side bar icons display and hiding feature as user logged in
const sideCart = document.getElementById("sideCart");
const sideProfile = document.getElementById("sideProfile");
const sideLogout = document.getElementById("sideLogout");
const sideLogin = document.getElementById("sideLogin");

if (token) {
  sideCart.style.display = "block";
  sideProfile.style.display = "block";
  sideLogout.style.display = "block";
  sideLogin.style.display = "none";
  sideLogout.addEventListener("click", (e) => {
    e.preventDefault();
    Cookies.remove("token");
    window.location.reload();
  });
} else {
  sideCart.style.display = "none";
  sideProfile.style.display = "none";
  sideLogout.style.display = "none";
  sideLogin.style.display = "block";
}

//navbar icons display and hiding feature as user logged in
const mediaQuery = window.matchMedia("(max-width: 850px)");
mediaQuery.addEventListener(
  "change",
  () => {
    window.location.reload;
  },
  { passive: true }
);

const cart = document.getElementById("cart");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");
const login = document.getElementById("login");

if (token) {
  if (innerWidth < 850) {
    cart.style.display = "none";
    profile.style.display = "none";
    logout.style.display = "none";
    login.style.display = "none";
  } else {
    cart.style.display = "block";
    profile.style.display = "block";
    logout.style.display = "block";
    login.style.display = "none";
  }
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    Cookies.remove("token");
    window.location.reload();
  });
} else {
  if (innerWidth < 850) {
    cart.style.display = "none";
    profile.style.display = "none";
    logout.style.display = "none";
    login.style.display = "none";
  } else {
    cart.style.display = "none";
    profile.style.display = "none";
    logout.style.display = "none";
    login.style.display = "block";
  }
}

//navbar
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

//landing page
var config = {
  cUrl: "https://api.api-ninjas.com/v1/city?name=",
  cKey: "IL9rJUN5pdFp1SAz8T7h3A==zsZkE8LwblsFdzLE",
};

const searchBar = document.getElementById("searchBar");

searchBar.addEventListener("keyup", (e) => {
  console.log(e);
  const city = e.target.value;
  if (city) {
    fetch(config.cUrl + city, {
      headers: {
        "X-Api-Key": config.cKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
});

//price selector
var slider = document.getElementById("priceRange");
var output = document.getElementById("priceDisplay");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
};

//default date value
document.getElementById("checkInDate").defaultValue = "2024-07-21";
document.getElementById("checkOutDate").defaultValue = "2024-07-21";

//price change from range to input
function smallDevices() {
  const priceConvertor = document.getElementById(".convertor");
  priceConvertor.type = "number";
}

//swiper for cards
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
