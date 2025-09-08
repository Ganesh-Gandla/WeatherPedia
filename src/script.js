const searchBar = document.querySelector("#search-bar")
const searchButton = document.querySelector("#search-button")

const cityName = document.querySelector('#cityName')
const weatherIcon = document.querySelector('#weather-icon')
const currentTemp = document.querySelector('#temperature')
const tempUnits = document.querySelector('#tempUnits')
const currentDay = document.querySelector('#current-day')
const currentTime = document.querySelector('#current-time')
const weatherDescription = document.querySelector('#weather-description')

const toggleC = document.querySelector('#toggle-c')
const toggleF = document.querySelector('#toggle-f')

const windSpeed = document.querySelector('#wind-speed')
const sunriseTime = document.querySelector('#sunrise')
const sunsetTime = document.querySelector('#sunset')
const humidityLevel = document.querySelector('#humidity')
const visibilityDistance = document.querySelector('#visibility')
const airQuality = document.querySelector('#air-quality')
const uvIndex = document.querySelector('#uv-index')

let formatedData = {}
let TempInC = true

searchButton.addEventListener("click", handleClick)
toggleC.addEventListener("click",HandleToggleC)
toggleF.addEventListener("click",HandleToggleF)

function handleClick() {
  console.log("clicked")
  console.log(searchBar.value)
  searchCity(searchBar.value)
}

async function fetchdata({city}) {
  console.log("fetching...")
  console.log(city)
  let requestedData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=107e46fc26949b76b90f98c326fa4a26&units=metric`)
  formatedData = await requestedData.json();
  console.log(formatedData)
}

// const formatedData = {
//   "coord": {
//     "lon": 83.2093,
//     "lat": 17.69
//   },
//   "weather": [
//     {
//       "id": 804,
//       "main": "Clouds",
//       "description": "overcast clouds",
//       "icon": "04d"
//     }
//   ],
//   "base": "stations",
//   "main": {
//     "temp": 28.91,
//     "feels_like": 31.83,
//     "temp_min": 28.91,
//     "temp_max": 28.91,
//     "pressure": 1001,
//     "humidity": 66,
//     "sea_level": 1001,
//     "grnd_level": 995
//   },
//   "visibility": 10000,
//   "wind": {
//     "speed": 6.65,
//     "deg": 211,
//     "gust": 8.83
//   },
//   "clouds": {
//     "all": 96
//   },
//   "dt": 1756985325,
//   "sys": {
//     "country": "IN",
//     "sunrise": 1756944823,
//     "sunset": 1756989554
//   },
//   "timezone": 19800,
//   "id": 1253102,
//   "name": "Visakhapatnam",
//   "cod": 200
// }





let ForecastArr = []
let container = document.querySelector('#forecast-container')




async function searchCity(city) {
  
  await fetchdata({city})
  const localDetails = getWeatherTimes(formatedData);
  cityName.innerHTML = formatedData.name
  weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${formatedData.weather[0].icon}@2x.png`);
  console.log(TempInC)
  currentTemp.innerHTML = (TempInC == true)?formatedData.main.temp:((formatedData.main.temp*(9/5))+32).toFixed(2);
  currentDay.innerHTML = localDetails.date
  currentTime.innerHTML = localDetails.time
  weatherDescription.innerHTML = formatedData.weather[0].description
  windSpeed.innerHTML = formatedData.wind.speed
  sunriseTime.innerHTML = localDetails.sunrise
  sunsetTime.innerHTML = localDetails.sunset
  humidityLevel.innerHTML = formatedData.main.humidity
  visibilityDistance.innerHTML = formatedData.visibility / 1000
  getcards();
}



// searchButton.addEventListener('click',fetchdata);


async function fetchForecastData(lat, lon) {
  let forecastData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c0e8fa7277f461fb485dd5a1ad2e27ba`)
  let formatedForecastData = await forecastData.json();
  ForecastArr = [formatedForecastData.list[8],
  formatedForecastData.list[16],
  formatedForecastData.list[24],
  formatedForecastData.list[32],
  formatedForecastData.list[39]
  ]
  console.log(ForecastArr)
}


async function getcards() {
  await fetchForecastData(formatedData.coord.lat, formatedData.coord.lon);
  ForecastArr.forEach((item) => {
    let artical = document.createElement("div")
    artical.innerHTML = `<article class="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-[1.02]">
                        <h3 id='date-day-1' class="text-sm font-semibold text-gray-500 mb-2">${item.dt_txt.split(' ')[0]}</h3>
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="" class="h-20 w-20">
                        <div class="flex items-center space-x-2 text-lg">
                            <span id="max-day-1" class="font-bold text-gray-800">${(item.main.temp_max - 273.15).toFixed(1)}</span>
                            <span id="min-day-1" class="text-gray-400">${(item.main.temp_min - 273.15).toFixed(1)}</span>
                        </div>
                        <div class="flex items-center space-x-2 text-sm">
                            <img src="./icons/humidity.png" alt="" class="h-4 w-4">
                            <span id="humidity-day-1" class="font-bold text-gray-800">${item.main.humidity}</span>
                            <img src="./icons/windy.png" alt="" class="h-4 w-4">
                            <span id="wind-day-1" class="font-bold text-gray-800">${item.wind.speed}</span>
                            
                        </div>
                    </article>`
    container.appendChild(artical);
  });
}

// date and time

function getWeatherTimes(data) {

  // Function to format a timestamp into a readable time string (e.g., "05:45 PM")
  const formatTime = (timestamp) => {
    // Add the timezone offset to the UTC timestamp
    const localTime = new Date((timestamp) * 1000);
    const timeString = localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return timeString
  };

  // Get the current date and time
  const currentDate = new Date(data.dt * 1000);

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = formatTime(data.dt);

  // Get the formatted sunrise and sunset times
  const formattedSunrise = formatTime(data.sys.sunrise);
  const formattedSunset = formatTime(data.sys.sunset);

  return {
    date: formattedDate,
    time: formattedTime,
    sunrise: formattedSunrise.replace(/( AM| PM)/, ''),
    sunset: formattedSunset.replace(/( AM| PM)/, ''),
  };
}

function HandleToggleC(){
  console.log("data in C")
  TempInC = true
  tempUnits.innerHTML = "°C"
  toggleC.setAttribute("class","px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700")
  toggleF.setAttribute("class","px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 bg-gray-200 text-gray-800 hover:bg-gray-300")
  currentTemp.innerHTML = formatedData.main.temp
}

function HandleToggleF(){
  console.log("data in F")
  TempInC = false
  tempUnits.innerHTML = "°F"
  toggleF.setAttribute("class","px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700")
  toggleC.setAttribute("class","px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200 bg-gray-200 text-gray-800 hover:bg-gray-300")
  currentTemp.innerHTML = ((formatedData.main.temp*(9/5))+32).toFixed(2)
}






