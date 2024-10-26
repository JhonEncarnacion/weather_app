const search = document.querySelector("#search_location");
const savedLocations = document.querySelectorAll("saved_location");
const savedCity = document.querySelector("sl_city");
const savedTime = document.querySelector("sl_time");
const savedTemp = document.querySelector("sl_temp");
const savedSkyCondition = document.querySelector("sl_sky_condition");
const savedHighTemp = document.querySelector("sl_high");
const savedLowTemp = document.querySelector("sl_low");

const WEATHER_API_KEY = "2a0265e0ff8f4b72881145040242110";
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";
const CURRENT = "/current.json";
const FORECAST = "/forecast.json";
const HISTORY = "/history.json";
const MARINE = "/marine.json";
const ASTRONOMY = "/astronomy.json";

search.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        if (search.value.trim() === "") {
            alert("An empty search field is not allowed!");
        } else {
            fetchWeather();
        }
    }
});

async function fetchWeather() {
    const location = search.value;
    const currentWeatherAPI = new URL(WEATHER_API_BASE_URL + CURRENT + "?key=" + WEATHER_API_KEY);
    currentWeatherAPI.searchParams.set("q", location);
    const forecastWeatherAPI = new URL(WEATHER_API_BASE_URL + FORECAST + "?key=" + WEATHER_API_KEY);
    forecastWeatherAPI.searchParams.set("q", location);
    forecastWeatherAPI.searchParams.set("days", 7);
    const historyWeatherAPI = new URL(WEATHER_API_BASE_URL + HISTORY + "?key=" + WEATHER_API_KEY);
    historyWeatherAPI.searchParams.set("q", location);
    historyWeatherAPI.searchParams.set("dt", "2024-10-26");
    const marineWeatherAPI = new URL(WEATHER_API_BASE_URL + MARINE + "?key=" + WEATHER_API_KEY);
    marineWeatherAPI.searchParams.set("q", location);
    marineWeatherAPI.searchParams.set("days", 7);
    const astronomyWeatherAPI = new URL(WEATHER_API_BASE_URL + ASTRONOMY + "?key=" + WEATHER_API_KEY);
    astronomyWeatherAPI.searchParams.set("q", location);
    astronomyWeatherAPI.searchParams.set("dt", "2024-10-26");
    
    try {
        const getCurrentWeather = await fetch(currentWeatherAPI);
        const getCurrentWeatherJSON = await getCurrentWeather.json();
        console.log(getCurrentWeatherJSON);
        const getForecastWeather = await fetch(forecastWeatherAPI);
        const getForecastWeatherJSON = await getForecastWeather.json();
        console.log(getForecastWeatherJSON);
        const getHistoryWeather = await fetch(historyWeatherAPI);
        const getHistoryWeatherJSON = await getHistoryWeather.json();
        console.log(getHistoryWeatherJSON);
        const getMarineWeather = await fetch(marineWeatherAPI);
        const getMarineWeatherJSON = await getMarineWeather.json();
        console.log(getMarineWeatherJSON);
        const getAstronomyWeather = await fetch(astronomyWeatherAPI);
        const getAstronomyWeatherJSON = await getAstronomyWeather.json();
        console.log(getAstronomyWeatherJSON);

        const search = document.querySelector("#search_location");
        const savedLocations = document.querySelectorAll("saved_location");
        const savedCity = document.querySelector("sl_city");
        const fetchSavedCity = getCurrentWeatherJSON.location.name;
        console.log("City: " + fetchSavedCity);
        const savedTime = document.querySelector("sl_time");
        const fetchSavedTime = getCurrentWeatherJSON.location.localtime;
        console.log("Time: " + fetchSavedTime);
        const savedTemp = document.querySelector("sl_temp");
        const fetchSavedTemp = getCurrentWeatherJSON.current.temp_f;
        console.log("Temperature: " + fetchSavedTemp);
        const savedSkyCondition = document.querySelector("sl_sky_condition");
        const fetchSavedSkyCondition = getCurrentWeatherJSON.current.condition.text;
        console.log("Sky Condition: " + fetchSavedSkyCondition);
        const savedHighTemp = document.querySelector("sl_high");
        const fetchSavedHighTemp = getForecastWeatherJSON.forecast.forecastday[0].day.maxtemp_f;
        console.log("High: " + fetchSavedHighTemp);
        const savedLowTemp = document.querySelector("sl_low");
        const fetchSavedLowTemp = getForecastWeatherJSON.forecast.forecastday[0].day.mintemp_f;
        console.log("Low: " + fetchSavedLowTemp);

    } catch (error) {
        console.error("ERROR: " + error);
    }
}