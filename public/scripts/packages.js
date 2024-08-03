// axios
//   .get("http://localhost:3000/api/package/listings")
//   .then((response) => {
//     const packages = response.data;
//     const packageList = document.querySelector(".row");

//     packages.forEach((packageItem) => {
//       const packageHtml = `
//         <a href="/TravelTicketFrontend/public/pages/package-detail.html?id=${packageItem._id}" class="listing-link">
//           <div class="card">
//             <img src="${packageItem.image.url}" class="card-img" alt="..." />
//             <div class="card-body">
//               <h2 class="card-title">${packageItem.title}</h2>
//               <p class="card-text">${packageItem.location}</p>
//               <p class="card-text">${packageItem.country}</p>
//               <p>Price: &#8377;<span class="card-text1">${packageItem.price}</span>/ night</p>
//             </div>
//           </div>
//         </a>
//       `;

//       const packageElement = document.createElement("div");
//       packageElement.innerHTML = packageHtml;
//       packageList.appendChild(packageElement);
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });




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
    renderData();
  }
  
  function prevactive() {
    link[page - 1].classList.remove("active");
    page--;
    link[page - 1].classList.add("active");
    renderData();
  }
  
  function fetchData() {
    axios
      .get("http://localhost:4000/api/package/listings")
      .then((response) => {
        packages = response.data;
        renderData();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  function renderData() {
    const limit = 6;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const packageList = document.querySelector(".row");
    packageList.innerHTML = ""; // clearing the previous data
  
    const result = packages.slice(startIndex, endIndex);
  
    result.forEach((packageItem) => {
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

    // Check if there are more pages to navigate to
  const nextPage = page + 1;
  const prevPage = page - 1;
  const hasNextPage = nextPage * limit <= packages.length;
  const hasPrevPage = prevPage >= 1;

  // Hide or show the next and previous buttons
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  nextBtn.style.display = hasNextPage ? "block" : "none";
  prevBtn.style.display = hasPrevPage ? "block" : "none";
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  fetchData(); // call the function initially to fetch the data