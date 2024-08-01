const totalAmount = localStorage.getItem("totalAmount");
const subTotal = localStorage.getItem("subTotal");

document.getElementById("total-amount").innerHTML = `&#8377;${totalAmount}`;
document.getElementById("sub-total").innerHTML = `&#8377;${subTotal}`;

const form = document.querySelector(".place-order");
const btn = document.querySelector(".payment");

btn.addEventListener("click", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const jsonData = Object.fromEntries(formData.entries());
  jsonData.amount = totalAmount;

  try {
    const response = await axios.post(
      "http://localhost:4000/api/checkout/payment",
      jsonData
    );
    console.log(response.data);
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Error occurred");
    }
  } catch (error) {
    console.error(error);
  }
});
