// ----------------- DOM Elements -----------------
const searchBar = document.querySelector("#search-bar");
const searchButton = document.querySelector("#search-button");
const cityName = document.querySelector('#cityName');
const weatherIcon = document.querySelector('#weather-icon');
const currentTemp = document.querySelector('#temperature');
const tempUnits = document.querySelector('#tempUnits');
const currentDay = document.querySelector('#current-day');
const currentTime = document.querySelector('#current-time');
const weatherDescription = document.querySelector('#weather-description');

const toggleC = document.querySelector('#toggle-c');
const toggleF = document.querySelector('#toggle-f');

const windSpeed = document.querySelector('#wind-speed');
const sunriseTime = document.querySelector('#sunrise');
const sunsetTime = document.querySelector('#sunset');
const humidityLevel = document.querySelector('#humidity');
const visibilityDistance = document.querySelector('#visibility');

const forecastContainer = document.querySelector('#forecast-container');
const recentList = document.getElementById('recent-searches');

// ----------------- State -----------------
let formatedData = {};
let TempInC = true;
let ForecastArr = [];

const MAX_RECENTS = 5;
const STORAGE_KEY = 'recentSearches';

// ----------------- Event Listeners -----------------
searchButton.addEventListener("click", handleClick);
toggleC.addEventListener("click", handleToggleC);
toggleF.addEventListener("click", handleToggleF);
searchBar.addEventListener('focus', renderDropdown);
searchBar.addEventListener('blur', () => {
  setTimeout(() => recentList.classList.add('hidden'), 150);
});

// Event: Hide dropdown on document click (outside input/dropdown)
document.addEventListener('click', (e) => {
  if (
    !searchBar.contains(e.target) &&
    !recentList.contains(e.target)
  ) {
    recentList.classList.add('hidden');
  }
});

// ----------------- Handlers -----------------
function handleClick() {
  const city = searchBar.value.trim();
  if (!city) return;
  saveSearch(city);
  renderDropdown();
  searchCity(city);
  recentList.classList.add('hidden');
}

function handleToggleC() {
  TempInC = true;
  tempUnits.textContent = "°C";
  toggleC.className = activeToggleClass();
  toggleF.className = inactiveToggleClass();
  currentTemp.textContent = formatedData.main.temp;
}

function handleToggleF() {
  TempInC = false;
  tempUnits.textContent = "°F";
  toggleF.className = activeToggleClass();
  toggleC.className = inactiveToggleClass();
  currentTemp.textContent = convertToF(formatedData.main.temp);
}

// ----------------- Main Weather Logic -----------------
async function searchCity(city) {
  await fetchWeather(city);

  const { date, time, sunrise, sunset } = getWeatherTimes(formatedData);
  cityName.textContent = formatedData.name;
  weatherIcon.src = `https://openweathermap.org/img/wn/${formatedData.weather[0].icon}@2x.png`;
  currentTemp.textContent = TempInC
    ? formatedData.main.temp
    : convertToF(formatedData.main.temp);

  currentDay.textContent = date;
  currentTime.textContent = time;
  weatherDescription.textContent = formatedData.weather[0].description;
  windSpeed.textContent = formatedData.wind.speed;
  sunriseTime.textContent = sunrise;
  sunsetTime.textContent = sunset;
  humidityLevel.textContent = formatedData.main.humidity;
  visibilityDistance.textContent = (formatedData.visibility / 1000).toFixed(1);

  renderForecast();
}

// ----------------- API Calls -----------------
async function fetchWeather(city) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=107e46fc26949b76b90f98c326fa4a26&units=metric`);
  formatedData = await res.json();
}

async function fetchForecastData(lat, lon) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c0e8fa7277f461fb485dd5a1ad2e27ba`);
  const forecast = await res.json();
  ForecastArr = [8, 16, 24, 32, 39].map(i => forecast.list[i]);
}

// ----------------- Forecast UI -----------------
async function renderForecast() {
  await fetchForecastData(formatedData.coord.lat, formatedData.coord.lon);
  forecastContainer.innerHTML = ''; // clear previous

  ForecastArr.forEach(item => {
    const article = document.createElement("div");
    article.innerHTML = `
      <article class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-[1.02]">
        <h3 class="text-sm font-semibold text-gray-500 mb-2">${item.dt_txt.split(' ')[0]}</h3>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="" class="h-20 w-20">
        <div class="flex items-center space-x-2 text-lg">
          <span class="font-bold text-gray-800">${kelvinToC(item.main.temp_max)}</span>
          <span class="text-gray-400">${kelvinToC(item.main.temp_min)}</span>
        </div>
        <div class="flex items-center space-x-2 text-sm">
          <img src="./icons/humidity.png" alt="" class="h-4 w-4">
          <span class="font-bold text-gray-800">${item.main.humidity}</span>
          <img src="./icons/windy.png" alt="" class="h-4 w-4">
          <span class="font-bold text-gray-800">${item.wind.speed}</span>
        </div>
      </article>`;
    forecastContainer.appendChild(article);
  });
}

// ----------------- Date & Time Formatting -----------------
function getWeatherTimes(data) {
  const formatTime = (ts) => new Date(ts * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const date = new Date(data.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return {
    date,
    time: formatTime(data.dt),
    sunrise: formatTime(data.sys.sunrise).replace(/( AM| PM)/, ''),
    sunset: formatTime(data.sys.sunset).replace(/( AM| PM)/, ''),
  };
}

// ----------------- Recent Searches -----------------
function getRecentSearches() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveSearch(term) {
  if (!term.trim()) return;
  let recents = getRecentSearches().filter(t => t.toLowerCase() !== term.toLowerCase());
  recents.unshift(term);
  if (recents.length > MAX_RECENTS) recents.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recents));
}

function renderDropdown() {
  const recents = getRecentSearches();
  recentList.innerHTML = '';

  if (recents.length === 0) {
    recentList.classList.add('hidden');
    return;
  }

  recents.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.className = 'px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700';
    
    // ✅ Handle dropdown click: set value, hide dropdown, search
    li.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent blur before click registers
      searchBar.value = item;
      recentList.classList.add('hidden');
      handleClick(); // 🔍 Trigger search
      recentList.classList.add('hidden');
    });

    recentList.appendChild(li);
  });

  recentList.classList.remove('hidden');
}

// ----------------- Utilities -----------------
function kelvinToC(k) {
  return (k - 273.15).toFixed(1);
}

function convertToF(c) {
  return ((c * 9/5) + 32).toFixed(2);
}

function activeToggleClass() {
  return "px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700";
}

function inactiveToggleClass() {
  return "px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 bg-gray-200 text-gray-800 hover:bg-gray-300";
}
