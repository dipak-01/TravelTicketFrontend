const token = Cookies.get("token");

const fetchUserDetails = async () => {
  const response = await axios.post(
    "http://localhost:4000/api/user/details",
    {},
    { headers: { token } }
  );
  console.log(response.data);
};

const fetchTickets = async () => {
  const response = await axios.post(
    "http://localhost:4000/api/checkout/booked",
    {},
    { headers: { token } }
  );
  console.log(response.data.data);
};

fetchUserDetails();
fetchTickets();
