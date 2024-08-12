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

    //getting the package through api
    axios
      .get(`http://localhost:4000/api/package/${packageId}`)
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

    //promo code implementation
    const promoCodeInput = document.getElementById("promo-code");
    const applyPromoCodeButton = document.getElementById("apply-promo");
    let promoCode = "";
    let discountAmount = 0;

    function resetPromoCodeDiv() {
      promoCodeInput.style.border = "";
      promoCodeInput.style.boxShadow = "";
      applyPromoCodeButton.disabled = false;
      applyPromoCodeButton.style.opacity = 1;
      const subTotal = basePrice;
      document.getElementById("sub-total").innerHTML = `&#8377;${subTotal}`;
      totalAmount = subTotal + 2000 + 300;
      document.getElementById(
        "total-amount"
      ).innerHTML = `&#8377;${totalAmount}`;
      document.getElementById("promo-code-message").innerHTML = "";
    }

    applyPromoCodeButton.addEventListener("click", async () => {
      const inputPromoCode = promoCodeInput.value.trim();
      if (inputPromoCode && inputPromoCode !== promoCode) {
        try {
          const response = await axios.post(
            "http://localhost:4000/api/checkout/promovalidate",
            { promoCode: inputPromoCode },
            {
              headers: { token },
            }
          );
          if (response.data.success) {
            promoCode = inputPromoCode;
            let sub = totalAmount;
            const discountPercentage = response.data.discountPercentage;
            discountAmount = (totalAmount * discountPercentage) / 100;
            sub -= discountAmount;
            document.getElementById("total-amount").innerHTML = `&#8377;${sub}`;

            // Add effects to show promo code is added
            promoCodeInput.style.border = "1px green";
            promoCodeInput.style.boxShadow = "0 0 10px green";
            document.getElementById(
              "promo-code-message"
            ).innerHTML = `Promo code applied! You got a ${discountPercentage}% discount.`;
            document.getElementById("promo-code-message").style.color = "green";
            applyPromoCodeButton.disabled = true;
            applyPromoCodeButton.style.opacity = 0.5;
          } else {
            alert(response.data.message);
            resetPromoCodeDiv();
          }
        } catch (error) {
          console.log(error);
          resetPromoCodeDiv();
        }
      } else if (inputPromoCode === promoCode) {
        // If the new promo code is the same as the previous one, do nothing
        return;
      }
    });

    promoCodeInput.addEventListener("input", () => {
      resetPromoCodeDiv();
    });

    //Total Calculation
    function updateTotal() {
      const journeyDuration = parseInt(
        document.getElementById("journey-duration").value
      );
      const subTotal = journeyDuration * basePrice;
      const travelExpenses = 2000;
      totalAmount = subTotal + travelExpenses + 300 - discountAmount;
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
      jsonData.promoCode = promoCodeInput.value.trim();

      try {
        const response = await axios.post(
          "http://localhost:4000/api/checkout/payment",
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
