const urlParams = new URLSearchParams(window.location.search);
const packageId = urlParams.get("id");
console.log("Package ID:", packageId);

axios
  .get(`http://localhost:4000/api/package/${packageId}`)
  .then((response) => {
    const packageData = response.data;
    console.log(packageData);

    const packageDetailsHtml = `
      <h2>${packageData.title}</h2>
      <p>${packageData.description}</p>
      <p>Location: ${packageData.location}</p>
      <p>Country: ${packageData.country}</p>
      <p>Price: &#8377;${packageData.price}/ night</p>
      <img src="${packageData.image.url}" alt="img" />
    `;

    const packageDetailsContainer = document.querySelector(".package-details");
    packageDetailsContainer.innerHTML = packageDetailsHtml;
  })
  .catch((error) => {
    console.error(error);
  });

const btn = document.getElementById("proceed-to-checkout");
btn.addEventListener("click", () => {
  const url = `/TravelTicketFrontend/public/pages/cart.html?id=${packageId}`;
  window.location.href = url;
});
