const searchBar	= document.querySelector("#search-bar")
const searchButton = document.querySelector("#search-button")

const cityName = document.querySelector('#cityName')
const weatherIcon = document.querySelector('#weather-icon')
const currentTemp = document.querySelector('#temperature')
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


console.log()

// async function fetchdata(){
//     console.log("fetching...")
//     let requestedData = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Visakhapatnam&appid=107e46fc26949b76b90f98c326fa4a26&units=metric")
//     let formatedData = await requestedData.json();
//     console.log(formatedData)
// }

const formatedData = {
  "coord": {
    "lon": 83.2093,
    "lat": 17.69
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 28.91,
    "feels_like": 31.83,
    "temp_min": 28.91,
    "temp_max": 28.91,
    "pressure": 1001,
    "humidity": 66,
    "sea_level": 1001,
    "grnd_level": 995
  },
  "visibility": 10000,
  "wind": {
    "speed": 6.65,
    "deg": 211,
    "gust": 8.83
  },
  "clouds": {
    "all": 96
  },
  "dt": 1756985325,
  "sys": {
    "country": "IN",
    "sunrise": 1756944823,
    "sunset": 1756989554
  },
  "timezone": 19800,
  "id": 1253102,
  "name": "Visakhapatnam",
  "cod": 200
}

const localDetails = getWeatherTimes(formatedData);

cityName.innerHTML = formatedData.name
currentTemp.innerHTML= formatedData.main.temp
currentDay.innerHTML = localDetails.date
currentTime.innerHTML = localDetails.time
weatherDescription.innerHTML = formatedData.weather[0].description
windSpeed.innerHTML = formatedData.wind.speed
sunriseTime.innerHTML = localDetails.sunrise
sunsetTime.innerHTML = localDetails.sunset
humidityLevel.innerHTML = formatedData.main.humidity
visibilityDistance.innerHTML = formatedData.visibility/1000





// searchButton.addEventListener('click',fetchdata);

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






