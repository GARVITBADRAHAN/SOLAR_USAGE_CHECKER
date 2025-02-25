window.addEventListener('DOMContentLoaded', () => {
    // Retrieve the booking data from localStorage
    const bookingDataString = localStorage.getItem("bookingData");
    
    if (bookingDataString) {
      const bookingData = JSON.parse(bookingDataString);
      
      // Log the booking data to the console for debugging
      console.log("Booking Data:", bookingData);
      
      // Display the booking data in the <pre> element
      document.getElementById("debugOutput").textContent = JSON.stringify(bookingData, null, 2);
    } else {
      console.log("No booking data available.");
      document.getElementById("debugOutput").textContent = "No booking data available.";
    }
  });
  