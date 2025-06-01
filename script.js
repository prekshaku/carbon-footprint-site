document.getElementById('carbonForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get inputs
  const carKm = parseFloat(document.getElementById('travel').value) || 0;
  const electricityKwh = parseFloat(document.getElementById('electricity').value) || 0;
  const flightHours = parseFloat(document.getElementById('flights').value) || 0;
  const meatGrams = parseFloat(document.getElementById('meat').value) || 0;
  const dairyGrams = parseFloat(document.getElementById('dairy').value) || 0;
  const plantGrams = parseFloat(document.getElementById('plant').value) || 0;

  // Emission factors (kg CO2 per unit)
  const carFactor = 0.21;       // per km
  const electricityFactor = 0.5; // per kWh
  const flightFactor = 90;      // per flight hour (estimate)

  // Food emission factors per gram (kg CO2 per gram)
  const meatFactor = 0.027;     // 27 kg CO2 per kg = 0.027 per gram
  const dairyFactor = 0.013;    // 13 kg CO2 per kg = 0.013 per gram
  const plantFactor = 0.002;    // 2 kg CO2 per kg = 0.002 per gram

  // Calculate emissions
  const carEmission = carKm * carFactor;
  const electricityEmission = electricityKwh * electricityFactor;
  const flightEmission = flightHours * flightFactor;
  const meatEmission = meatGrams * meatFactor;
  const dairyEmission = dairyGrams * dairyFactor;
  const plantEmission = plantGrams * plantFactor;

  // Total emissions
  const totalEmission = carEmission + electricityEmission + flightEmission + meatEmission + dairyEmission + plantEmission;

  // Show total emission
  document.getElementById('result').innerHTML = `
    <p>Your estimated daily carbon footprint is <strong>${totalEmission.toFixed(2)} kg CO₂</strong>.</p>
  `;

  // Suggestion logic based on highest emission source
  let suggestionText = "";

  // Find max emission category for suggestion
  const emissions = {
    Car: carEmission,
    Electricity: electricityEmission,
    Flights: flightEmission,
    Meat: meatEmission,
    Dairy: dairyEmission,
    Plant: plantEmission,
  };

  // Find category with max emission
  const maxCategory = Object.keys(emissions).reduce((a, b) => emissions[a] > emissions[b] ? a : b);

  switch(maxCategory) {
    case 'Car':
      suggestionText = "🚗 Consider using public transport, biking, or carpooling to reduce car travel emissions.";
      break;
    case 'Electricity':
      suggestionText = "💡 Reduce electricity use by switching to LED lights, turning off unused devices, and using energy-efficient appliances.";
      break;
    case 'Flights':
      suggestionText = "✈️ Try to limit flights, choose direct routes, or offset emissions by supporting climate projects.";
      break;
    case 'Meat':
      suggestionText = "🥩 Reduce meat consumption or choose sustainably sourced meat.";
      break;
    case 'Dairy':
      suggestionText = "🥛 Reduce dairy intake or switch to plant-based alternatives.";
      break;
    case 'Plant':
      suggestionText = "🌿 Great job! Keep eating more plant-based foods to lower your carbon footprint.";
      break;
    default:
      suggestionText = "🌍 Keep up sustainable choices!";
  }

  document.getElementById('suggestions').innerHTML = `
    <p><strong>Suggestion to Reduce Your Carbon Footprint:</strong><br>${suggestionText}</p>
  `;

  // Draw bar chart with Chart.js
  // Destroy previous chart instance if exists
  if (window.emissionChartInstance) {
    window.emissionChartInstance.destroy();
  }

  const ctx = document.getElementById('emissionChart').getContext('2d');

  window.emissionChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(emissions),
      datasets: [{
        label: 'Kg CO₂ emissions',
        data: Object.values(emissions),
        backgroundColor: [
          '#3498db', '#f39c12', '#e74c3c', '#9b59b6', '#2ecc71', '#95a5a6'
        ],
        borderRadius: 5,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Kg CO₂',
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y.toFixed(2)} kg CO₂`
          }
        }
      }
    }
  });
});
