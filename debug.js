window.addEventListener('DOMContentLoaded', () => {
    // Fetch booking data from the Node.js backend
    fetch('http://localhost:5000/api/bookings')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.statusText);
        }
        return response.json();
      })
      .then(bookings => {
        console.log("Bookings Data:", bookings);
        // Display the fetched booking data in the <pre> element
        document.getElementById("debugOutput").textContent = JSON.stringify(bookings, null, 2);
      })
      .catch(error => {
        console.error("Error fetching booking data:", error);
        document.getElementById("debugOutput").textContent = "Error fetching booking data: " + error.message;
      });
  });
  