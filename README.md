# Weather-Pedia

Weather-Pedia is a responsive web application that provides real-time weather updates and a 5-day forecast. Users can search by city or use their current location. The background updates dynamically based on current weather conditions.

## Features

* Search by city or current location
* Display current weather: temperature, description, and icon
* Toggle temperature units (°C / °F)
* View wind speed, humidity, visibility, sunrise, and sunset
* 5-day forecast
* Recent searches stored in local storage
* Input validation and error handling

## Setup

1. **Clone the repo**

```bash
git clone https://github.com/your-username/weather-pedia.git
cd weather-pedia/src
```

2. **Build Tailwind CSS**

```bash
npx tailwindcss -i ./input.css -o ./output.css --watch
```

3. **Open in browser**

Open `index.html` or run:

```bash
npx live-server
```

4. **Add API Key**

In `script.js`, replace with your OpenWeatherMap API key:

```javascript
const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
```

## Usage

* Type a city and click search
* Use location button for current location weather
* Toggle between °C and °F
* Scroll for 5-day forecast
* Click recent searches in the dropdown

## Folder Structure

```
src/
├─ index.html
├─ input.css
├─ output.css
├─ script.js
├─ icons/
└─ bg/
```

## License

MIT License
