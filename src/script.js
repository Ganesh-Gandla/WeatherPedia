// ----------------- DOM Elements -----------------
const searchBar = document.querySelector("#search-bar");
const searchButton = document.querySelector("#search-button");
const locationButton = document.querySelector('#location-button');
const validationMessage = document.querySelector('#validation-message');
const apiError = document.getElementById('api-error');
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
locationButton.addEventListener('click', handleLocationSearch);
toggleC.addEventListener("click", handleToggleC);
toggleF.addEventListener("click", handleToggleF);
searchBar.addEventListener('focus', renderDropdown);
searchBar.addEventListener('blur', () => {
  setTimeout(() => recentList.classList.add('hidden'), 150);
});

searchBar.addEventListener('input', () => {
  hideValidationMessage();
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
  const validation = validateCityInput(city);

  if (!validation.valid) {
    showValidationMessage(validation.message);
    return;
  }

  hideValidationMessage(); // Clear message on valid input
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

async function handleLocationSearch() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const city = await getCityFromCoordinates(latitude, longitude);
      if (city) {
        searchBar.value = city; // Optional: set input field
        saveSearch(city);       // Optional: store in recents
        searchCity(city);       // ✅ Use your existing logic
      } else {
        alert("Could not determine city from your location.");
      }
    } catch (err) {
      alert("Error getting city name.");
      console.error(err);
    }

  }, (error) => {
    alert("Unable to retrieve your location.");
    console.error(error);
  });
}


// ----------------- Main Weather Logic -----------------
async function searchCity(city) {
  try {
    await fetchWeather(city);
  } catch {
    return; // Stop processing if weather fetch fails
  }

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

  renderForecast(); // will fetch forecast next
}


// ----------------- API Calls -----------------
async function fetchWeather(city) {
  const apiKey = '107e46fc26949b76b90f98c326fa4a26';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`City "${city}" not found.`);
      } else if (res.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      } else {
        throw new Error("Unable to fetch weather data.");
      }
    }

    formatedData = await res.json();
    hideApiError(); // ✅ clear any past error
  } catch (error) {
    console.error(error);
    showApiError(error.message);
    throw error; // ✅ rethrow so caller knows it failed
  }
}


async function fetchForecastData(lat, lon) {
  const apiKey = 'c0e8fa7277f461fb485dd5a1ad2e27ba';
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Forecast fetch failed.");
    const forecast = await res.json();
    ForecastArr = [8, 16, 24, 32, 39].map(i => forecast.list[i]);
    hideApiError();
  } catch (err) {
    console.error(err);
    showApiError("Could not load forecast data.");
    ForecastArr = [];
  }
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


// search city name with coordinates 
async function getCityFromCoordinates(lat, lon) {
  const apiKey = '107e46fc26949b76b90f98c326fa4a26';
  const res = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
  const data = await res.json();

  // Defensive check
  if (data && data.length > 0) {
    return data[0].name; // Return the city name
  }

  return null;
}

// Input validation 

function validateCityInput(input) {
  const trimmed = input.trim();

  if (!trimmed) return { valid: false, message: "City name cannot be empty." };
  if (trimmed.length < 2) return { valid: false, message: "City name is too short." };
  if (/^\d+$/.test(trimmed)) return { valid: false, message: "City name cannot be numbers only." };
  if (!/^[a-zA-Z\s\-]+$/.test(trimmed)) return { valid: false, message: "Only letters, spaces, and hyphens are allowed." };

  return { valid: true, message: "" };
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

function showValidationMessage(message) {
  validationMessage.textContent = message;
  validationMessage.classList.remove('hidden');
}

function hideValidationMessage() {
  validationMessage.textContent = '';
  validationMessage.classList.add('hidden');
}

function showApiError(message) {
  apiError.textContent = message;
  apiError.classList.remove('hidden');
}

function hideApiError() {
  apiError.textContent = '';
  apiError.classList.add('hidden');
}
