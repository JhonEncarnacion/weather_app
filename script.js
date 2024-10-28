// Navigation variables
const search = document.querySelector("#search_location");
const savedLocations = document.querySelectorAll("saved_location");

// Saved Locations variables
const slCity = document.querySelector("sl_city");
const slTime = document.querySelector("sl_time");
const slTemp = document.querySelector("sl_temp");
const slSkyCondition = document.querySelector("sl_sky_condition");
const slHighTemp = document.querySelector("sl_high");
const slLowTemp = document.querySelector("sl_low");

// Main Weather variables
const mwCity = document.querySelector("mw_city");
const mwTemp = document.querySelector("mw_temperature");
const mwSkyCondition = document.querySelector("mw_sky_condition");
const mwFeelsLike = document.querySelector("mw_feels_like");
const mwHighTemp = document.querySelector("mw_high");
const mwLowTemp = document.querySelector("mw_low");

// Hourly Forecast variables
const hfTime = document.querySelector("hf_time");
const hfSymbol = document.querySelector("hf_symbol");
const hfTemp = document.querySelector("hf_temperature");
const hfPrec = document.querySelector("hf_number");

// Weekly Forecast variables
const wfSymbol = document.querySelector("wf_symbol");
const wfDay = document.querySelector("wf_day");
const wfSkyCondition = document.querySelector("wf_sky_condition");
const wfPrec = document.querySelector("wf_percentage");
const wfHighTemp = document.querySelector("wf_high");
const wfLowTemp = document.querySelector("wf_low");

// Weather Conditions variables
const windNumber = document.querySelectorAll("number")[0];
const windArrow = document.getElementById("arrow");
const humidityNumber = document.querySelectorAll("number")[1];
const uviNumber = document.querySelectorAll("number")[2];
const pressureNumber = document.querySelectorAll("number")[3];
const sunriseNumber = document.querySelectorAll("number")[4];
const sunsetNumber = document.querySelectorAll("number")[5];

// Weather API variables
const WEATHER_API_KEY = "2a0265e0ff8f4b72881145040242110";
const WEATHER_API_URL = "https://api.weatherapi.com/v1/forecast.json";

// Array variables
const savedLocationsCollection = [];
const savedLocationCollection = [];
const savedLocationVariablesCollection = [slCity, slTime, slTemp, slSkyCondition, slHighTemp, slLowTemp, mwFeelsLike];
const hourlyForecastCollection = [];
const hourlyForecastVariablesCollection = [hfTime, hfSymbol, hfTemp, hfPrec];
const weeklyForecastCollection = [];
const weeklyForecastVariablesCollection = [wfSymbol, wfDay, wfSkyCondition, wfPrec, wfHighTemp, wfLowTemp];

// Updates weather app on location search
search.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        if (search.value.trim() === "") {
            alert("An empty search field is not allowed!");
        } else {
            fetchWeather();
            updateWeather();
        }
    }
});

// Fetches weather data and presents it to the user
async function fetchWeather() {
    try {
        // Stores the location inputted by the user
        const location = search.value;
        
        // Creates variable for the weather API
        const forecastWeatherAPI = new URL(WEATHER_API_URL + "?key=" + WEATHER_API_KEY);
        forecastWeatherAPI.searchParams.set("q", location);
        forecastWeatherAPI.searchParams.set("days", 7);

        // Fetches weather data and prints it out
        const getForecastWeather = await fetch(forecastWeatherAPI);
        const getForecastWeatherJSON = await getForecastWeather.json();
        console.log(getForecastWeatherJSON);

        // Stores JSON weather data and prints them out
        console.log("SAVED LOCATIONS VARIABLES:")
        const savedLocation = [];
        const fetchSavedCity = getForecastWeatherJSON.location.name;
        savedLocation.push(fetchSavedCity);
        console.log("City: " + fetchSavedCity);
        const fetchSavedTime = convertTimeFormat(getForecastWeatherJSON.location.localtime.split(" ")[1]);
        savedLocation.push(fetchSavedTime);
        console.log("Time: " + fetchSavedTime);
        const fetchSavedTemp = Math.round(getForecastWeatherJSON.current.temp_f);
        savedLocation.push(fetchSavedTemp);
        console.log("Temperature: " + fetchSavedTemp);
        const fetchSavedSkyCondition = getForecastWeatherJSON.current.condition.text;
        savedLocation.push(fetchSavedSkyCondition);
        console.log("Sky Condition: " + fetchSavedSkyCondition);
        const fetchSavedHighTemp = Math.round(getForecastWeatherJSON.forecast.forecastday[0].day.maxtemp_f);
        savedLocation.push(fetchSavedHighTemp);
        console.log("High: " + fetchSavedHighTemp);
        const fetchSavedLowTemp = Math.round(getForecastWeatherJSON.forecast.forecastday[0].day.mintemp_f);
        savedLocation.push(fetchSavedLowTemp);
        console.log("Low: " + fetchSavedLowTemp);
        const fetchMainFeelsLike = Math.round(getForecastWeatherJSON.current.feelslike_f);
        savedLocation.push(fetchMainFeelsLike);
        console.log("Feels like: " + fetchMainFeelsLike);
        savedLocationCollection.push(savedLocation);

        console.log("HOURLY FORECAST VARIABLES:");
        // Converts time into a float and then rounds up
        const hfStart = Math.ceil(getForecastWeatherJSON.location.localtime.split(" ")[1].split(":").join("."));
        // Stores length of the hour array 
        const hfLength = getForecastWeatherJSON.forecast.forecastday[0].hour.length;
        // Prefix for hourly forecast variables to save time
        const hfIntro = getForecastWeatherJSON.forecast.forecastday[0].hour;

        for (let i = hfStart; i < hfLength + hfStart; i++) {
            const hourlyForecast = [];
            // [i % hfLength] is used to make the hour array wrappable
            const fetchHFTime = convertTimeFormat(hfIntro[i % hfLength].time.split(" ")[1]);
            hourlyForecast.push(fetchHFTime);
            console.log("Hourly Time: " + fetchHFTime);
            const fetchHFSkyCondition = hfIntro[i % hfLength].condition.text;
            hourlyForecast.push(fetchHFSkyCondition);
            console.log("Hourly Sky Condition: " + fetchHFSkyCondition);
            const fetchHFTemp = Math.round(hfIntro[i % hfLength].temp_f);
            hourlyForecast.push(fetchHFTemp);
            console.log("Hourly Temperature: " + fetchHFTemp);
            const fetchHFPrec = Math.round(Math.max(hfIntro[i % hfLength].chance_of_rain, hfIntro[i % hfLength].chance_of_snow));
            hourlyForecast.push(fetchHFPrec);
            console.log("Hourly Precipitation: " + fetchHFPrec);
            hourlyForecastCollection.push(hourlyForecast);
        }
        
        console.log("WEEKLY FORECAST VARIABLES:");
        const wfIntro = getForecastWeatherJSON.forecast.forecastday;

        for (i in wfIntro) {
            const weeklyForecast = [];
            // The first date index returns "Today" instead of a day of the week
            const fetchWFDay = i != 0 ? getDayOfTheWeek(wfIntro[i].date) : "Today";
            weeklyForecast.push(fetchWFDay);
            console.log("Weekly Day: " + fetchWFDay);
            const fetchWFSkyCondition = wfIntro[i].day.condition.text;
            weeklyForecast.push(fetchWFSkyCondition);
            console.log("Weekly Sky Condition: " + fetchWFSkyCondition);
            const fetchWFPrec = Math.round(Math.max(wfIntro[i].day.daily_chance_of_rain, wfIntro[i].day.daily_chance_of_snow));
            weeklyForecast.push(fetchWFPrec);
            console.log("Weekly Precipitation: " + fetchWFPrec);
            const fetchWFHighTemp = Math.round(wfIntro[i].day.maxtemp_f);
            weeklyForecast.push(fetchWFHighTemp);
            console.log("Weekly High: " + fetchWFHighTemp);
            const fetchWFLowTemp = Math.round(wfIntro[i].day.mintemp_f);
            weeklyForecast.push(fetchWFLowTemp);
            console.log("Weekly Low: " + fetchWFLowTemp);
            weeklyForecastCollection.push(weeklyForecast);
        }

        console.log("WEATHER CONDITIONS VARIBALES:");
        const weatherConditions = [];
        const fetchWindSpeed = getForecastWeatherJSON.current.wind_mph;
        weatherConditions.push(fetchWindSpeed);
        const fetchWindDirection = getForecastWeatherJSON.current.wind_dir;
        weatherConditions.push(fetchWindDirection);
        rotateArrow(fetchWindDirection);
        console.log(`Wind: ${fetchWindSpeed}mph | Direction: ${fetchWindDirection}`);
        const fetchHumidity = getForecastWeatherJSON.current.humidity;
        weatherConditions.push(fetchHumidity);
        console.log(`Humidity: ${fetchHumidity}%`);
        const fetchUVI = getForecastWeatherJSON.current.uv;
        weatherConditions.push(fetchUVI);
        console.log(`UVI: ${fetchUVI}`);
        const fetchPressure = getForecastWeatherJSON.current.pressure_in;
        weatherConditions.push(fetchPressure);
        console.log(`Pressure: ${fetchPressure}inHg`);
        const fetchSunriseTime = getForecastWeatherJSON.forecast.forecastday[0].astro.sunrise;
        weatherConditions.push(fetchSunriseTime);
        const fetchSunsetTime = getForecastWeatherJSON.forecast.forecastday[0].astro.sunset;
        weatherConditions.push(fetchSunsetTime);
        console.log(`Sunrise: ${fetchSunriseTime} | Sunset: ${fetchSunsetTime}`);
    } catch (error) {
        console.error("ERROR: " + error);
    }
}

// Converts from 24-hour time to 12-hour time
function convertTimeFormat(originalTime) {
    let [hours, minutes] = originalTime.split(":");
    let unit = hours < 12 ? "AM" : "PM";
    if (hours != 12 && hours != 0) {
        hours = hours % 12;
    } else {
        hours = 12;
    }
    return `${hours}:${minutes} ${unit}`;
}

// Returns day of the week of a given date
function getDayOfTheWeek(originalDate) {
    let date = originalDate;
    const [y, m, d] = date.split("-");
    date = [m, d, y].join("-");
    let newDate = new Date(date);
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfTheWeek[newDate.getDay()];
}

function rotateArrow(windDirection) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    directions.forEach((value, index) => {
        if (value === windDirection) {
            let rotation = 22.5 * index;
            windArrow.style.transform = `rotate(${rotation}deg)`;
        }
    });
}

function updateWeather() {

}