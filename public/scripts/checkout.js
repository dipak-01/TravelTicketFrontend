// Fetch token from cookies
const token = Cookies.get("token");

if (token) {
  const totalAmount = Cookies.get("totalAmount");
  const subTotal = Cookies.get("subTotal");
  const details = JSON.parse(Cookies.get("journeyDetails"));
  console.log(details);

  document.getElementById("total-amount").innerHTML = `&#8377;${totalAmount}`;
  document.getElementById("sub-total").innerHTML = `&#8377;${subTotal}`;

  const form = document.querySelector(".place-order");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());
    jsonData.amount = totalAmount;
    jsonData.startDate = details.startDate;
    jsonData.location = details.location;
    jsonData.journeyDuration = details.journeyDuration;

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
  //alert("Not Authorized")
  window.location.href = "/TravelTicketFrontend/public/pages/login.html";
}
