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
  const body = document.getElementById("body");
  body.style.overflow = "hidden";
  document.querySelectorAll("hideonMobile").forEach((element) => {
    element.style.display = "none";
  });
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("show");
  const body = document.getElementById("body");
  body.style.overflow = "";
}

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

    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

    journeyDateInput.min = minDate;

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

    //getting the package through api
    axios
      .get(
        `https://travel-ticket-backend.onrender.com/api/package/details/${packageId}`
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

    //Total Calculation
    function updateTotal() {
      const journeyDuration = parseInt(
        document.getElementById("journey-duration").value
      );
      const subTotal = journeyDuration * basePrice;
      const travelExpenses = 2000;
      let totalAmount = subTotal + travelExpenses + 300;

      if (promoCodeApplied) {
        discountAmount = parseInt(totalAmount * discountPercentage) / 100;
        totalAmount -= discountAmount;
      }

      document.getElementById("sub-total").innerHTML = `&#8377;${subTotal}`;
      document.getElementById(
        "travel-expenses"
      ).innerHTML = `&#8377;${travelExpenses}`;
      document.getElementById(
        "total-amount"
      ).innerHTML = `&#8377;${totalAmount}`;
    }

    //promo code implementation
    let promoCodeApplied = false;

    const promoCodeInput = document.getElementById("promo-code");
    const applyPromoCodeButton = document.getElementById("apply-promo");
    let promoCode = "";
    let discountAmount = 0;

    function resetPromoCodeDiv() {
      promoCodeInput.style.border = "";
      promoCodeInput.style.boxShadow = "";
      applyPromoCodeButton.disabled = false;
      applyPromoCodeButton.style.opacity = 1;
      promoCodeApplied = false;
      promoCode = "";
      discountPercentage = 0;
      discountAmount = 0;
      updateTotal();
      document.getElementById("promo-code-message").innerHTML = "";
    }

    promoCodeInput.addEventListener("input", () => {
      if (!promoCodeApplied) {
        resetPromoCodeDiv();
      }
    });

    let discountPercentage = 0;

    applyPromoCodeButton.addEventListener("click", async () => {
      const inputPromoCode = promoCodeInput.value.trim();
      if (inputPromoCode && inputPromoCode !== promoCode) {
        try {
          const response = await axios.post(
            "https://travel-ticket-backend.onrender.com/api/checkout/promovalidate",
            { promoCode: inputPromoCode },
            {
              headers: { token },
            }
          );
          if (response.data.success) {
            promoCodeApplied = true;
            promoCode = inputPromoCode;
            discountPercentage = response.data.discountPercentage;
            const totalAmountBeforeDiscount = parseInt(
              document
                .getElementById("total-amount")
                .textContent.replace(/[^0-9]/g, "")
            );
            console.log(totalAmountBeforeDiscount);

            discountAmount =
              parseInt(totalAmountBeforeDiscount * discountPercentage) / 100;
            console.log(discountAmount);
            updateTotal();
            totalAmount = totalAmountBeforeDiscount - discountAmount;
            console.log(totalAmount);
            document.getElementById(
              "total-amount"
            ).innerHTML = `&#8377;${totalAmount}`;

            // Add effects to show promo code is added
            promoCodeInput.style.border = "1px green";
            promoCodeInput.style.boxShadow = "0 0 10px green";
            document.getElementById(
              "promo-code-message"
            ).innerHTML = `Promo code applied! You got a ${discountPercentage}% discount.`;
            document.getElementById("promo-code-message").style.color = "green";
            // applyPromoCodeButton.disabled = true;
            applyPromoCodeButton.style.opacity = 0.5;
          } else {
            alert(response.data.message);
            promoCodeApplied = false;
            resetPromoCodeDiv();
          }
        } catch (error) {
          console.log(error);
          resetPromoCodeDiv();
        }
      } else if (inputPromoCode === promoCode) {
        return;
      }
    });

    promoCodeInput.addEventListener("click", resetPromoCodeDiv);

    document
      .getElementById("remove-promo-code")
      .addEventListener("click", () => {
        resetPromoCodeDiv();
        promoCodeInput.value = "";
      });

    document
      .getElementById("journey-duration")
      .addEventListener("change", function () {
        //resetPromoCodeDiv();
        // promoCodeApplied = false;
        updateTotal();
      });

    const form = document.querySelector(".place-order");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const jsonData = Object.fromEntries(formData.entries());
      jsonData.amount = totalAmount;
      jsonData.startDate = new Date(journeyDateInput.value);
      jsonData.location = document.getElementById("location").textContent;
      jsonData.journeyDuration = parseInt(journeySelect.value);
      jsonData.promoCode = promoCodeInput.value.trim();

      try {
        const response = await axios.post(
          "https://travel-ticket-backend.onrender.com/api/checkout/payment",
          jsonData,
          {
            headers: { token },
          }
        );
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
