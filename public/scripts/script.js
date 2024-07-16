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
