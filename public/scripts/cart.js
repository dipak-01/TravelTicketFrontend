const token = Cookies.get("token");

if (!token) {
  alert("Not Authorzied");
  window.location.href = "/TravelTicketFrontend/public/pages/login.html";
} else {
  const urlParams = new URLSearchParams(window.location.search);
  const packageId = urlParams.get("id");

  if (packageId) {
    document.getElementById("body").style.display = "block";
    const journeySelect = document.getElementById("journey-duration");
    const journeyDateInput = document.getElementById("journey-date");

    for (let i = 1; i <= 15; i++) {
      const option = document.createElement("option");
      option.value = i;
      if (i === 1) {
        option.text = "1 day";
      } else {
        option.text = i + " days";
      }
      journeySelect.appendChild(option);
    }

    let basePrice = 0;
    let totalAmount = 0;

    axios
      .get(
        `https://travel-ticket-backend.onrender.com/api/package/${packageId}`
      )
      .then((response) => {
        const cartItem = response.data;

        document.getElementById("package-image").src = cartItem.image.url;
        document.getElementById("destination").innerHTML = cartItem.title;
        document.getElementById(
          "location"
        ).innerHTML = `${cartItem.location}, ${cartItem.country}`;
        document.getElementById("price").innerHTML = cartItem.price;
        basePrice = cartItem.price;
        const subTotal = basePrice;
        document.getElementById("sub-total").innerHTML = `&#8377;${subTotal}`;
        totalAmount = subTotal + 2000 + 300;
        document.getElementById(
          "total-amount"
        ).innerHTML = `&#8377;${totalAmount}`;
      })
      .catch((error) => {
        console.error(error);
      });

    function updateTotal() {
      const journeyDuration = parseInt(
        document.getElementById("journey-duration").value
      );
      const subTotal = journeyDuration * basePrice;
      const travelExpenses = 2000;
      totalAmount = subTotal + travelExpenses + 300;
      document.getElementById("sub-total").innerHTML = `&#8377;${subTotal}`;
      document.getElementById(
        "travel-expenses"
      ).innerHTML = `&#8377;${travelExpenses}`;
      document.getElementById(
        "total-amount"
      ).innerHTML = `&#8377;${totalAmount}`;
    }

    document
      .getElementById("journey-duration")
      .addEventListener("change", updateTotal);

    const form = document.querySelector(".place-order");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const jsonData = Object.fromEntries(formData.entries());
      jsonData.amount = totalAmount;
      jsonData.startDate = new Date(journeyDateInput.value);
      jsonData.location = document.getElementById("location").textContent;
      jsonData.journeyDuration = parseInt(journeySelect.value);

      try {
        const response = await axios.post(
          "https://travel-ticket-backend.onrender.com/api/checkout/payment",
          jsonData,
          {
            headers: { token },
          }
        );
        console.log(response.data);
        if (response.data.success) {
          const { session_url } = response.data;
          window.location.replace(session_url);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    });
  } else {
    alert("no cart item found");
    window.location.href = "/TravelTicketFrontend/public/pages/packages.html";
  }
}
