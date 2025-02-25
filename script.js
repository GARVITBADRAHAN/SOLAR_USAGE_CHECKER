// ----------------------
// Calculation & Results
// ----------------------
function calculatePanels() {
  // Retrieve input values and convert them to numbers
  const summerBill = parseFloat(document.getElementById("summerBill").value);
  const monsoonBill = parseFloat(document.getElementById("monsoonBill").value);
  const winterBill = parseFloat(document.getElementById("winterBill").value);
  const unitCost = parseFloat(document.getElementById("unitCost").value);

  // Validate inputs
  if (
    isNaN(summerBill) ||
    isNaN(monsoonBill) ||
    isNaN(winterBill) ||
    isNaN(unitCost) ||
    unitCost <= 0
  ) {
    alert("Please enter valid numbers for all fields. Unit cost must be greater than 0.");
    return;
  }

  // Calculate daily consumption for each season (assuming a 30-day month)
  const summerDailyConsumption = (summerBill / unitCost) / 30;
  const monsoonDailyConsumption = (monsoonBill / unitCost) / 30;
  const winterDailyConsumption = (winterBill / unitCost) / 30;

  // Overall average daily consumption (an average of the three seasons)
  const overallAvgConsumption = (summerDailyConsumption + monsoonDailyConsumption + winterDailyConsumption) / 3;
  const monthlyAvgConsumption = overallAvgConsumption * 30;
  const yearlyAvgConsumption = overallAvgConsumption * 365;

  // Panel types data with average daily generation (kWh) for a typical 300W panel.
  const panelTypes = [
    {
      name: "Monocrystalline Silicon Panels",
      summer: 1.9,
      monsoon: 1.35,
      winter: 1.1,
      costRange: "INR 12,000 – INR 15,000"
    },
    {
      name: "Polycrystalline Silicon Panels",
      summer: 1.7,
      monsoon: 1.2,
      winter: 1.0,
      costRange: "INR 10,000 – INR 13,000"
    },
    {
      name: "Thin-Film Solar Panels",
      summer: 1.35,
      monsoon: 1.0,
      winter: 0.9,
      costRange: "INR 9,000 – INR 12,000"
    }
  ];

  // For each panel type, calculate the number of panels needed per season
  // and determine the maximum (worst-case) requirement.
  const panelResults = panelTypes.map(function(panel) {
    const summerPanels = Math.ceil(summerDailyConsumption / panel.summer);
    const monsoonPanels = Math.ceil(monsoonDailyConsumption / panel.monsoon);
    const winterPanels = Math.ceil(winterDailyConsumption / panel.winter);
    const totalPanels = Math.max(summerPanels, monsoonPanels, winterPanels);
    return {
      name: panel.name,
      costRange: panel.costRange,
      total: totalPanels
    };
  });

  // Prepare the result data to store and pass to the results page.
  const resultData = {
    monthlyAverage: monthlyAvgConsumption,
    yearlyAverage: yearlyAvgConsumption,
    panelResults: panelResults
  };

  // Store the result data in sessionStorage (this is okay for result data)
  sessionStorage.setItem("solarResultData", JSON.stringify(resultData));

  // Redirect to the results page
  window.location.href = "result.html";
}

function initResults() {
  const resultBox = document.getElementById("resultBox");
  const dataString = sessionStorage.getItem("solarResultData");
  if (!dataString) {
    resultBox.innerHTML = "<p>No data available. Please go back and enter your details.</p>";
    return;
  }

  const data = JSON.parse(dataString);
  let htmlContent = `
    <p><strong>Monthly Average Consumption:</strong> ${data.monthlyAverage.toFixed(2)} kWh/month</p>
    <p><strong>Yearly Average Consumption:</strong> ${data.yearlyAverage.toFixed(2)} kWh/year</p>
    <h2>Panel Requirements</h2>
    <table>
      <thead>
        <tr>
          <th>Panel Type</th>
          <th>Total Panels Needed</th>
          <th>Cost Range</th>
        </tr>
      </thead>
      <tbody>`;
  data.panelResults.forEach(function(result) {
    htmlContent += `<tr>
      <td>${result.name}</td>
      <td>${result.total}</td>
      <td>${result.costRange}</td>
    </tr>`;
  });
  htmlContent += `</tbody></table>`;
  resultBox.innerHTML = htmlContent;
}

function goBack() {
  window.location.href = "index.html";
}

function goToBooking() {
  window.location.href = "booking.html";
}

// ----------------------
// Booking Form Functions
// ----------------------
function handleBooking(event) {
  event.preventDefault();
  
  // Get form field values
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const postalCode = document.getElementById("postalCode").value;
  const appointmentDate = document.getElementById("appointmentDate").value;
  const appointmentTime = document.getElementById("appointmentTime").value;
  const additionalInfo = document.getElementById("additionalInfo").value;

  // Create booking object
  const bookingData = {
    fullName,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    appointmentDate,
    appointmentTime,
    additionalInfo
  };

  // Send the booking data to the Node.js server via POST request.
  // Update the URL if your backend is deployed elsewhere.
  fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Booking Data Submitted:", data);
    // Display a confirmation message
    const confirmationDiv = document.getElementById("bookingConfirmation");
    confirmationDiv.style.display = "block";
    confirmationDiv.innerHTML = `<p>Thank you, ${fullName}! Your appointment has been booked successfully. Booking ID: ${data.booking._id}</p>`;
    // Reset the form
    document.getElementById("bookingForm").reset();
  })
  .catch(error => {
    console.error("Error submitting booking:", error);
    alert("There was an error submitting your booking.");
  });
}

function goBackToResults() {
  window.location.href = "result.html";
}

// ----------------------
// Initialization
// ----------------------
// Initialize the booking form on the booking page.
if (document.body.id === "bookingPage") {
  window.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
      bookingForm.addEventListener("submit", handleBooking);
    }
  });
}

// Initialize results page if on results page.
if (document.body.id === "resultsPage") {
  window.addEventListener("DOMContentLoaded", initResults);
}
