const urlParams = new URLSearchParams(window.location.search);
const success = urlParams.get("success");
const orderId = urlParams.get("orderId");

const verifyPayment = async () => {
  const response = await axios.post(
    "http://localhost:4000/api/checkout/verify",
    {
      success,
      orderId,
    }
  );
  if (response.data.success) {
    const url = "/TravelTicketFrontend/public/pages/profile.html";
    window.location.href = url;
  } else {
    window.location.href = "/TravelTicketFrontend/index.html";
    alert(response.data.message);
  }
};

verifyPayment();
