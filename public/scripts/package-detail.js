const token = Cookies.get("token");
document.getElementById("body").style.display = "none";

const urlParams = new URLSearchParams(window.location.search);
const packageId = urlParams.get("id");

if (packageId) {
  document.getElementById("body").style.display = "block";
  axios
    .get(`http://localhost:4000/api/package/${packageId}`)
    .then((response) => {
      const packageData = response.data;

      const packageDetailsHtml = `
      <h2>${packageData.title}</h2>
      <p>${packageData.description}</p>
      <p>Location: ${packageData.location}</p>
      <p>Country: ${packageData.country}</p>
      <p>Price: &#8377;${packageData.price}/ night</p>
      <img src="${packageData.image.url}" alt="img" />
    `;

      const packageDetailsContainer =
        document.querySelector(".package-details");
      packageDetailsContainer.innerHTML = packageDetailsHtml;
    })
    .catch((error) => {
      console.log(error);
    });

  const btn = document.getElementById("proceed-to-checkout");
  btn.addEventListener("click", () => {
    if (token) {
      const url = `/TravelTicketFrontend/public/pages/cart.html?id=${packageId}`;
      window.location.href = url;
    } else {
      alert("Please login to proceed");
      const url = "/TravelTicketFrontend/public/pages/login.html";
      window.location.href = url;
    }
  });
} else {
  alert("Invalid Package selected");
  window.location.href = "/TravelTicketFrontend/public/pages/packages.html";
}
