//landing page
var config = {
  cUrl: "https://api.api-ninjas.com/v1/city?name=",
  cKey: "IL9rJUN5pdFp1SAz8T7h3A==zsZkE8LwblsFdzLE",
};

var selectCity = document.getElementById("inputBox").value.toUpperCase();
console.log(selectCity);
var url = config.cUrl + selectCity;
console.log(url);
function loadCities() {
  fetch(url, {
    headers: {
      "X-Api-Key": config.cKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}
