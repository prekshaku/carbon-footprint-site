document.addEventListener("DOMContentLoaded", function () {
  let chart;

  document.getElementById('carbonForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const travelKm = parseFloat(document.getElementById('travel').value);
    const electricityKwh = parseFloat(document.getElementById('electricity').value);
    const flightHours = parseFloat(document.getElementById('flights').value);

    const carFactor = 0.21;
    const electricityFactor = 0.475;
    const flightFactor = 90;

    const carEmission = travelKm * carFactor;
    const electricityEmission = electricityKwh * electricityFactor;
    const flightEmission = flightHours * flightFactor;

    const totalEmission = carEmission + electricityEmission + flightEmission;

    document.getElementById('result').innerHTML = `
      <p>Your estimated carbon footprint is <strong>${totalEmission.toFixed(2)} kg CO₂</strong>.</p>
    `;

       // Suggestion based on the highest emission source
let suggestionText = "";

if (carEmission >= electricityEmission && carEmission >= flightEmission) {
  suggestionText = "🚗 Consider using public transport, biking, or carpooling to reduce car travel emissions.";
} else if (electricityEmission >= carEmission && electricityEmission >= flightEmission) {
  suggestionText = "💡 Reduce electricity use by switching to LED lights, turning off unused devices, and using energy-efficient appliances.";
} else {
  suggestionText = "✈ Try to limit flights, choose direct routes, or offset emissions by supporting climate projects.";
}

document.getElementById('suggestions').innerHTML = `
  <p><strong>Suggestion to Reduce Your Carbon Footprint:</strong><br>${suggestionText}</p>
`;

    const ctx = document.getElementById('emissionChart').getContext('2d');

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Car Travel', 'Electricity', 'Flights'],
        datasets: [{
          label: 'CO₂ Emissions (kg)',
          data: [carEmission, electricityEmission, flightEmission],
          backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
          borderRadius: 8
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  });
});