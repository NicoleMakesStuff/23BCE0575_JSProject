const apiKey = 'b73ec40ac3b43e9b07fc3d286846f8ae'; // Get from OpenWeather
const weatherIcon = document.getElementById('weather-icon');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const forecastList = document.getElementById('forecast-list');
const darkModeToggle = document.getElementById('dark-mode-toggle');

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

  // Change Background Based on Weather
  changeBackground(data.weather[0].main);
}

// Fetch Weekly Forecast
async function getForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  forecastList.innerHTML = '';
  // Filter to get one forecast per day (every 8th record)
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
}

// Change Background Based on Weather
function changeBackground(weather) {
  document.body.classList.remove('sunny', 'rainy', 'snowy');
  if (weather.includes('Rain')) document.body.classList.add('rainy');
  if (weather.includes('Snow')) document.body.classList.add('snowy');
  if (weather.includes('Clear')) document.body.classList.add('sunny');
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
