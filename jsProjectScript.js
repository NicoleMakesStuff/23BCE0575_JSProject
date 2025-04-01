const apiKey = 'b73ec40ac3b43e9b07fc3d286846f8ae'; // Get from OpenWeather
const weatherIcon = document.getElementById('weather-icon');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const forecastList = document.getElementById('forecast-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const tempChartCanvas = document.getElementById('tempChart');
let tempChart;

// Get User Location
navigator.geolocation.getCurrentPosition(position => {
  const { latitude, longitude } = position.coords;
  getWeather(latitude, longitude);
  getForecast(latitude, longitude);
});

// Fetch Current Weather
async function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  changeBackground(data.weather[0].main);
}

// Fetch Hourly Forecast for Graph
async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  forecastList.innerHTML = '';
  const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

  dailyForecasts.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.classList.add('forecast-item');
    dayElement.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
      <p>${Math.round(day.main.temp)}°C</p>
    `;
    forecastList.appendChild(dayElement);
  });

  updateTemperatureChart(data.list.slice(0, 8));
}

// Update Temperature Chart
function updateTemperatureChart(forecastData) {
  const labels = forecastData.map(item => new Date(item.dt * 1000).getHours() + ':00');
  const temperatures = forecastData.map(item => item.main.temp);

  if (tempChart) {
    tempChart.destroy();
  }

  tempChart = new Chart(tempChartCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Time' } },
        y: { title: { display: true, text: 'Temperature (°C)' } }
      }
    }
  });
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
