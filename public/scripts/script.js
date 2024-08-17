document.addEventListener("DOMContentLoaded", function () {
  checkLoggedIn();
});

// Fetch token from cookies
const token = Cookies.get("token");

//checking user logged in or not
async function checkLoggedIn() {
  try {
    const response = await axios.get(
      "https://travel-ticket-backend.onrender.com/api/verifytoken",
      {
        headers: {
          token,
        },
      }
    );

    if (response.data.loggedIn) {
      // Show logged in UI elements
      document.querySelectorAll("[id='logout-btn']").forEach((element) => {
        element.style.display = "block";
      });
      document.querySelectorAll("[id='profile']").forEach((element) => {
        element.style.display = "block";
      });
      document.querySelectorAll("[id='login-btn']").forEach((element) => {
        element.style.display = "none";
      });
    } else {
      // Show logged out UI elements
      document.querySelectorAll("[id='logout-btn']").forEach((element) => {
        element.style.display = "none";
      });
      document.querySelectorAll("[id='profile']").forEach((element) => {
        element.style.display = "none";
      });
      document.querySelectorAll("[id='login-btn']").forEach((element) => {
        element.style.display = "block";
      });
    }
  } catch (error) {
    console.log(error);
    // Show error message or logged out UI elements
    document.querySelectorAll("[id='logout-btn']").forEach((element) => {
      element.style.display = "none";
    });
    document.querySelectorAll("[id='profile']").forEach((element) => {
      element.style.display = "none";
    });
    document.querySelectorAll("[id='login-btn']").forEach((element) => {
      element.style.display = "block";
    });
  }
}

document.querySelectorAll("[id='logout-btn']").forEach((element) => {
  element.addEventListener("click", () => {
    if (Cookies.get("token")) {
      Cookies.remove("token");
      console.log("removed");
    }
    window.location.href = "/TravelTicketFrontend/public/index.html";
    document.querySelectorAll("[id='logout-btn']").forEach((element) => {
      element.style.display = "none";
    });
    document.querySelectorAll("[id='profile']").forEach((element) => {
      element.style.display = "none";
    });
    document.querySelectorAll("[id='login-btn']").forEach((element) => {
      element.style.display = "block";
    });
  });
});

//navbar
function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.add("show");
  const body = document.querySelector(".body");
  body.style.overflow = "hidden";
  document.querySelectorAll("hideonMobile").forEach((element) => {
    element.style.display = "none";
  });
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("show");
  const body = document.querySelector(".body");
  body.style.overflow = "";
}

//redirect to details
function redirectToPackageDetail(id) {
  window.location.href = `/TravelTicketFrontend/public/pages/package-detail.html?id=${id}`;
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
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 1500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

const newsletterForm = document.querySelector(".mail");
const newsletterEmailInput = document.querySelector("#newsletter-email");
const newsletterResponseDiv = document.querySelector("#newsletter-response");

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = newsletterEmailInput.value.trim();
  if (email) {
    axios
      .post("https://travel-ticket-backend.onrender.com/api/subscribe", {
        email,
      })
      .then((response) => {
        if (response.data.success) {
          newsletterResponseDiv.innerHTML = `
            <div class="success-message">
              <i class="fas fa-check-circle"></i>
              Thank you for subscribing!
            </div>
          `;
          setTimeout(() => {
            newsletterResponseDiv.innerHTML = "";
            newsletterEmailInput.value = "";
          }, 5000);
        } else {
          newsletterResponseDiv.innerHTML = `
            <div class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              Error subscribing. Please try again.
            </div>
          `;
          setTimeout(() => {
            newsletterResponseDiv.innerHTML = "";
            newsletterEmailInput.value = "";
          }, 5000);
        }
      })
      .catch((error) => {
        console.error(error);
        newsletterResponseDiv.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            Error subscribing. Please try again.
          </div>
        `;
        setTimeout(() => {
          newsletterResponseDiv.innerHTML = "";
          newsletterEmailInput.value = "";
        }, 5000);
      });
  } else {
    newsletterResponseDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        Please enter a valid email address.
      </div>
    `;
    setTimeout(() => {
      newsletterResponseDiv.innerHTML = "";
      newsletterEmailInput.value = "";
    }, 5000);
  }
});
