const token = Cookies.get("token");

const urlParams = new URLSearchParams(window.location.search);
const packageId = urlParams.get("id");

if (packageId) {
  axios
    .get(
      `https://travel-ticket-backend.onrender.com/api/package/details/${packageId}`
    )
    .then((response) => {
      const packageData = response.data;

      const packageDetailsHtml = `
      <div class="img">
        <img src="${packageData.image.url}" alt="img" />
      </div>
      <div class="details">
      <div>
        <h2>${packageData.title}</h2>
        
        <p><span>Location:</span> ${packageData.location}</p>
        <p><span>Country:</span> ${packageData.country}</p>
        <p><span>Price:</span> &#8377;${packageData.price}/ night</p>
        <p class="des">${packageData.description}</p>
        </div>
      </div>
      
    `;

      const packageDetailsContainer =
        document.querySelector(".package-details");
      packageDetailsContainer.innerHTML = packageDetailsHtml;
    })
    .catch((error) => {
      console.error(error);
    });

  const btn = document.getElementById("proceed-to-checkout");
  btn.addEventListener("click", () => {
    if (token) {
      const url = `/TravelTicketFrontend/public/pages/cart.html?id=${packageId}`;
      window.location.href = url;
    } else {
      alert("Please Login to proceed");
      window.location.href = "/TravelTicketFrontend/public/pages/login.html";
    }
  });
} else {
  alert("Invalid Package selected");
  window.location.href = "/TravelTicketFrontend/public/pages/packages.html";
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