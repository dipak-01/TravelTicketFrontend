axios
  .get("http://localhost:4000/api/package/listings")
  .then((response) => {
    const packages = response.data;
    const packageList = document.querySelector(".row");

    packages.forEach((packageItem) => {
      const packageHtml = `
        <a href="/TravelTicketFrontend/public/pages/package-detail.html?id=${packageItem._id}" class="listing-link">
          <div class="card">
            <img src="${packageItem.image.url}" class="card-img" alt="..." />
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
  })
  .catch((error) => {
    console.error(error);
  });
