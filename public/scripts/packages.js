document.addEventListener("DOMContentLoaded", function () {
  checkLoggedIn();
  let loader = document.querySelector(".loader");
  document.body.style.overflowY = "hidden";
  // Fetch data and remove loader after rendering
  fetchData().then(() => {
    setTimeout(() => {
      loader.style.left = "-100%";
      document.body.style.overflowY = "";
    }, 1500);
  });
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
      document.querySelectorAll("[id='profile']").forEach((element) => {
        element.style.display = "block";
      });
    } else {
      document.querySelectorAll("[id='profile']").forEach((element) => {
        element.style.display = "none";
      });
    }
  } catch (error) {
    document.querySelectorAll("[id='profile']").forEach((element) => {
      element.style.display = "none";
    });
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

//seach bar functionality
let searchButtonClicked = false;

const searchBar = document.getElementById("searchLocation");
const searchButton = document.getElementById("search-btn");
const paginationPage = document.querySelector(".pagination");
let locationSearch = "";

searchBar.addEventListener("keyup", (event) => {
  locationSearch = event.target.value;
});

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  searchButtonClicked = true;
  paginationPage.style.display = "none";
  try {
    const response = await axios.get(
      `https://travel-ticket-backend.onrender.com/api/package/filter`,
      {
        params: {
          location: locationSearch,
        },
      }
    );
    renderSearchData(response.data);
  } catch (error) {
    console.error(`Error searching packages:`, error);
  }
});

function renderSearchData(packages) {
  const packageList = document.querySelector(".row");
  packageList.innerHTML = "";

  packages.forEach((packageItem) => {
    const packageHtml = `
        <a href="/TravelTicketFrontend/public/pages/package-detail.html?id=${packageItem._id}" class="listing-link">
          <div class="card">
            <img src="${packageItem.image.url}" class="card-img" alt="..."/>
            <div class="card-body">
              <h2 class="card-title">${packageItem.title}</h2>
              <p class="card-text">${packageItem.location}</p>
              <p class="card-text">${packageItem.country}</p>
              <p>Price: &#8377;<span class="card-text1">${packageItem.price}</span>/ night</p>
            </div>
          </div>
        </a>
      `;

    const packageElement = document.createElement("div");
    packageElement.innerHTML = packageHtml;
    packageList.appendChild(packageElement);
  });
}

//pagination

let link = document.querySelectorAll(".link");
let page = 1;
let packages = [];

for (let i = 0; i < link.length; i++) {
  link[i].addEventListener("click", (event) => {
    activeLink(event);
  });
}

let next = document.querySelector(".next-btn");
next.addEventListener("click", () => {
  if (page < link.length) {
    nextactive();
  }
});

let prev = document.querySelector(".prev-btn");
prev.addEventListener("click", () => {
  if (page > 1) {
    prevactive();
  }
});

function activeLink(event) {
  for (let i = 0; i < link.length; i++) {
    link[i].classList.remove("active");
  }
  event.target.classList.add("active");
  page = event.target.value;
  renderData();
}

function nextactive() {
  link[page - 1].classList.remove("active");
  page++;
  link[page - 1].classList.add("active");
  fetchData();
}

function prevactive() {
  link[page - 1].classList.remove("active");
  page--;
  link[page - 1].classList.add("active");
  fetchData();
}

async function fetchData() {
  try {
    const response = await axios.get(
      "https://travel-ticket-backend.onrender.com/api/package/listings",
      {
        params: {
          page: page,
          limit: 9,
        },
      }
    );
    packages = response.data.results;
    totalPages = response.data.totalPages;
    renderData();
  } catch (error) {
    console.error(error);
  }
}

function renderData() {
  const packageList = document.querySelector(".row");
  packageList.innerHTML = "";

  packages.forEach((packageItem) => {
    const packageHtml = `
        <a href="/TravelTicketFrontend/public/pages/package-detail.html?id=${packageItem._id}" class="listing-link">
          <div class="card">
            <img src="${packageItem.image.url}" class="card-img" alt="..."/>
            <div class="card-body">
              <h2 class="card-title">${packageItem.title}</h2>
              <p class="card-text">${packageItem.location}</p>
              <p class="card-text">${packageItem.country}</p>
              <p>Price: &#8377;<span class="card-text1">${packageItem.price}</span>/ night</p>
            </div>
          </div>
        </a>
      `;

    const packageElement = document.createElement("div");
    packageElement.innerHTML = packageHtml;
    packageList.appendChild(packageElement);
  });

  // Update the pagination links
  const paginationLinks = document.querySelector(".pagination ul");
  paginationLinks.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const linkHtml = `<li><a href="#" class="link" value="${i}">${i}</a></li>`;
    const linkElement = document.createElement("li");
    linkElement.innerHTML = linkHtml;
    paginationLinks.appendChild(linkElement);
  }

  // Update the active link
  const activeLink = document.querySelector(`.link[value="${page}"]`);
  activeLink.classList.add("active");

  // Check if there are more pages to navigate to
  const nextPage = page + 1;
  const prevPage = page - 1;
  const hasNextPage = nextPage <= totalPages;
  const hasPrevPage = prevPage >= 1;

  // Hide or show the next and previous buttons
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  nextBtn.style.visibility = hasNextPage ? "visible" : "hidden";
  prevBtn.style.visibility = hasPrevPage ? "visible" : "hidden";

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });
}

fetchData(); // call the function initially to fetch the data

//carousel
const pageCarousel = document.getElementById("pagination-list");
const linkWidth = pageCarousel.querySelector(".link").scrollWidth;
const prevButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");

prevButton.addEventListener("click", () => {
  if (window.innerWidth < 370) {
    pageCarousel.scrollLeft -= linkWidth * 1.8;
  } else if (window.innerWidth < 768) {
    pageCarousel.scrollLeft -= linkWidth * 2;
  } else if (window.innerWidth < 992) {
    pageCarousel.scrollLeft -= linkWidth * 1.8;
  } else {
    pageCarousel.scrollLeft -= linkWidth * 2;
  }
});

nextButton.addEventListener("click", () => {
  if (window.innerWidth < 370) {
    pageCarousel.scrollLeft += linkWidth * 1.8;
  } else if (window.innerWidth < 600) {
    pageCarousel.scrollLeft += linkWidth * 2;
  } else if (window.innerWidth < 768) {
    pageCarousel.scrollLeft += linkWidth * 2;
  } else if (window.innerWidth < 992) {
    pageCarousel.scrollLeft += linkWidth * 1.8;
  } else {
    pageCarousel.scrollLeft += linkWidth * 2;
  }
});

document.getElementById("cross-btn").addEventListener("click", function () {
  if (searchButtonClicked) {
    document.getElementById("searchLocation").value = "";
    paginationPage.style.display = "block";
    window.location.reload();
    searchButtonClicked = false;
  }
});
