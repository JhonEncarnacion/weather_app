// Navigation variables
const search = document.querySelector("#search_location");
const locationHistory = document.querySelector(".location_history");

// Saved Locations variables
const slCity = document.querySelector(".sl_city");
const slTime = document.querySelector(".sl_time");
const slTemp = document.querySelector(".sl_temperature");
const slSkyCondition = document.querySelector(".sl_sky_condition");
const slHighTemp = document.querySelector(".sl_high");
const slLowTemp = document.querySelector(".sl_low");
const slTopLeft = document.querySelector(".sl_top_left");
const slHighLow = document.querySelector(".sl_high_low");

// Main Weather variables
const mwCity = document.querySelector(".mw_city");
const mwTemp = document.querySelector(".mw_temperature");
const mwSkyCondition = document.querySelector(".mw_sky_condition");
const mwFeelsLike = document.querySelector(".mw_feels_like");
const mwHighTemp = document.querySelector(".mw_high");
const mwLowTemp = document.querySelector(".mw_low");

// Hourly Forecast variables
const hfTime = document.querySelectorAll(".hf_time");
const hfSymbol = document.querySelectorAll(".hf_symbol");
const hfTemp = document.querySelectorAll(".hf_temperature");
const hfPrec = document.querySelectorAll(".hf_number");

// Weekly Forecast variables
const wfSymbol = document.querySelectorAll(".wf_symbol");
const wfDay = document.querySelectorAll(".wf_day");
const wfSkyCondition = document.querySelectorAll(".wf_sky_condition");
const wfPrec = document.querySelectorAll(".wf_percentage");
const wfHighTemp = document.querySelectorAll(".wf_high");
const wfLowTemp = document.querySelectorAll(".wf_low");

// Weather Conditions variables
const windNumber = document.querySelectorAll(".number")[0];
const windArrow = document.getElementById("arrow");
const humidityNumber = document.querySelectorAll(".number")[1];
const uviNumber = document.querySelectorAll(".number")[2];
const pressureNumber = document.querySelectorAll(".number")[3];
const sunriseNumber = document.querySelectorAll(".number")[4];
const sunsetNumber = document.querySelectorAll(".number")[5];

// Array Weather variables
const savedLocationsCollection = [];
const savedLocationVariablesCollection = [slCity, slTime, slTemp, slSkyCondition, slHighTemp, slLowTemp];
const mainWeatherVariablesCollection = [mwCity, mwTemp, mwSkyCondition, mwFeelsLike, mwHighTemp, mwLowTemp];
const hourlyForecastVariablesCollection = [hfTime, hfSymbol, hfTemp, hfPrec];
const weeklyForecastVariablesCollection = [wfSymbol, wfDay, wfSkyCondition, wfPrec, wfHighTemp, wfLowTemp];
const weatherConditionsVariablesCollection = [windNumber, windArrow, humidityNumber, uviNumber, pressureNumber, sunriseNumber, sunsetNumber]

// Weather API variables
const WEATHER_API_KEY = "2a0265e0ff8f4b72881145040242110";
const WEATHER_API_URL = "https://api.weatherapi.com/v1/forecast.json";

// Updates weather app on location search
search.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
        if (search.value.trim() === "") {
            alert("An empty search field is not allowed!");
        } else {
            try {
                const weatherData = await fetchWeather();
                if (!weatherData) throw new Error("Failed to fetch weather data.");
                await updateNewSavedLocation(weatherData);
                await updateWeather(weatherData);
                search.value = "";
            } catch (error) {
                console.error(error);
                search.value = "";
                return;
            }
        }
    }
});

// Selects saved location when clicked on
document.addEventListener("click", (event) => {
    const savedLocations = document.querySelectorAll(".saved_location");
    if (event.target.tagName === "LI") {
        savedLocations.forEach(sl => {
            sl.classList.remove("selected");
        });
        event.target.classList.add("selected");
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
        if (!getForecastWeather.ok) {
            if (getForecastWeather.status === 400) {
                alert("The city could not be found, please enter a valid city name.");
            } else {
                alert("Could not fetch weather data, please try again later.");
            }
            return;
        }
        const getForecastWeatherJSON = await getForecastWeather.json();
        console.log(getForecastWeatherJSON);

        // Stores JSON weather data and prints them out
        // SAVED LOCATIONS VARIABLES
        const savedLocationCollection = [];
        const savedLocation = [];
        const fetchSavedCity = getForecastWeatherJSON.location.name;
        savedLocation.push(fetchSavedCity);
        const fetchSavedTime = convertTimeFormat(getForecastWeatherJSON.location.localtime.split(" ")[1]);
        savedLocation.push(fetchSavedTime);
        const fetchSavedTemp = Math.round(getForecastWeatherJSON.current.temp_f);
        savedLocation.push(fetchSavedTemp);
        const fetchSavedSkyCondition = getForecastWeatherJSON.current.condition.text;
        savedLocation.push(fetchSavedSkyCondition);
        const fetchSavedHighTemp = Math.round(getForecastWeatherJSON.forecast.forecastday[0].day.maxtemp_f);
        savedLocation.push(fetchSavedHighTemp);
        const fetchSavedLowTemp = Math.round(getForecastWeatherJSON.forecast.forecastday[0].day.mintemp_f);
        savedLocation.push(fetchSavedLowTemp);
        savedLocationCollection.push(savedLocation);

        // MAIN WEATHER VARIABLES
        const mainWeather = [];
        mainWeather.push(fetchSavedCity);
        mainWeather.push(fetchSavedTemp);
        mainWeather.push(fetchSavedSkyCondition);
        const fetchMainFeelsLike = Math.round(getForecastWeatherJSON.current.feelslike_f);
        mainWeather.push(fetchMainFeelsLike);
        mainWeather.push(fetchSavedHighTemp);
        mainWeather.push(fetchSavedLowTemp);
        savedLocationCollection.push(mainWeather);

        // HOURLY FORECAST VARIABLES
        const hourlyForecastCollection = [];
        // Converts time into a float and then rounds up
        const hfStart = Math.ceil(getForecastWeatherJSON.location.localtime.split(" ")[1].split(":").join("."));
        // Stores length of the hour array 
        const hfLength = getForecastWeatherJSON.forecast.forecastday[0].hour.length;
        // Prefix for hourly forecast variables to save time
        const hfIntro = getForecastWeatherJSON.forecast.forecastday[0].hour;
        
        for (let i = hfStart; i < hfLength + hfStart; i++) {
            const hourlyForecast = [];
            // [i % hfLength] is used to make the hour array wrappable
            const fetchHFTime = convertTimeFormatShort(hfIntro[i % hfLength].time.split(" ")[1]);
            hourlyForecast.push(fetchHFTime);
            const fetchHFSkyCondition = hfIntro[i % hfLength].condition.text.toLowerCase().trim();
            hourlyForecast.push(fetchHFSkyCondition);
            const fetchHFTemp = Math.round(hfIntro[i % hfLength].temp_f);
            hourlyForecast.push(fetchHFTemp);
            const fetchHFPrec = Math.round(Math.max(hfIntro[i % hfLength].chance_of_rain, hfIntro[i % hfLength].chance_of_snow));
            hourlyForecast.push(fetchHFPrec);
            hourlyForecastCollection.push(hourlyForecast);
        }
        savedLocationCollection.push(hourlyForecastCollection);
        
        // WEEKLY FORECAST VARIABLES
        const weeklyForecastCollection = [];
        const wfIntro = getForecastWeatherJSON.forecast.forecastday;

        for (i in wfIntro) {
            const weeklyForecast = [];
            // The first date index returns "Today" instead of a day of the week
            const fetchWFSkyCondition = wfIntro[i].day.condition.text.toLowerCase().trim();
            weeklyForecast.push(fetchWFSkyCondition);
            const fetchWFDay = i != 0 ? getDayOfTheWeek(wfIntro[i].date) : "Today";
            weeklyForecast.push(fetchWFDay);
            weeklyForecast.push(fetchWFSkyCondition);
            const fetchWFPrec = Math.round(Math.max(wfIntro[i].day.daily_chance_of_rain, wfIntro[i].day.daily_chance_of_snow));
            weeklyForecast.push(fetchWFPrec);
            const fetchWFHighTemp = Math.round(wfIntro[i].day.maxtemp_f);
            weeklyForecast.push(fetchWFHighTemp);
            const fetchWFLowTemp = Math.round(wfIntro[i].day.mintemp_f);
            weeklyForecast.push(fetchWFLowTemp);
            weeklyForecastCollection.push(weeklyForecast);
        }
        savedLocationCollection.push(weeklyForecastCollection);

        // WEATHER CONDITIONS VARIBALES
        const weatherConditions = [];
        const fetchWindSpeed = getForecastWeatherJSON.current.wind_mph;
        weatherConditions.push(fetchWindSpeed);
        const fetchWindDirection = getForecastWeatherJSON.current.wind_dir;
        weatherConditions.push(fetchWindDirection);
        const fetchHumidity = getForecastWeatherJSON.current.humidity;
        weatherConditions.push(fetchHumidity);
        const fetchUVI = getForecastWeatherJSON.current.uv;
        weatherConditions.push(fetchUVI);
        const fetchPressure = getForecastWeatherJSON.current.pressure_in;
        weatherConditions.push(fetchPressure);
        const fetchSunriseTime = getForecastWeatherJSON.forecast.forecastday[0].astro.sunrise.split(" ")[0];
        weatherConditions.push(fetchSunriseTime);
        const fetchSunsetTime = getForecastWeatherJSON.forecast.forecastday[0].astro.sunset.split(" ")[0];
        weatherConditions.push(fetchSunsetTime);
        savedLocationCollection.push(weatherConditions);
        savedLocationsCollection.push(savedLocationCollection);
        console.log(savedLocationCollection);
        console.log(savedLocationsCollection);
        return savedLocationCollection;
    } catch (error) {
        console.error("ERROR: " + error);
        alert("An error occurred while fetching weather data");
    }
}

// Creates a new saved location
async function updateNewSavedLocation(weatherData) {
    const firstSavedLocation = document.querySelector(".saved_location");
    if (firstSavedLocation != null) firstSavedLocation.classList.remove("selected");

    const newSavedLocation = document.createElement("li");
    newSavedLocation.classList.add("saved_location");
    newSavedLocation.setAttribute("tabindex", "0");
    newSavedLocation.classList.add("selected");
    locationHistory.prepend(newSavedLocation);

    // Makes the saved weather location accessible
    newSavedLocation.addEventListener("click", () => {
        updateWeather(weatherData);
    });

    const newSLTopLeft = document.createElement("div");
    newSLTopLeft.classList.add("sl_top_left");
    newSavedLocation.append(newSLTopLeft);
    const newSLCity = document.createElement("div");
    newSLCity.classList.add("sl_city");
    newSLCity.textContent = weatherData[0][0];
    newSLTopLeft.append(newSLCity);
    const newSLTime = document.createElement("div");
    newSLTime.classList.add("sl_time");
    newSLTime.textContent = weatherData[0][1];
    newSLTopLeft.append(newSLTime);
    const newSLTemp = document.createElement("div");
    newSLTemp.classList.add("sl_temperature");
    newSLTemp.textContent = weatherData[0][2];
    newSavedLocation.append(newSLTemp);
    const newSLSkyCondition = document.createElement("div");
    newSLSkyCondition.classList.add("sl_sky_condition");
    newSLSkyCondition.textContent = weatherData[0][3];
    newSavedLocation.append(newSLSkyCondition);
    const newSLHighLow = document.createElement("div");
    newSLHighLow.classList.add("sl_high_low");
    newSavedLocation.append(newSLHighLow);
    const newSLHighTemp = document.createElement("div");
    newSLHighTemp.classList.add("sl_high");
    newSLHighTemp.textContent = weatherData[0][4];
    newSLHighLow.append(newSLHighTemp);
    const newSLLowTemp = document.createElement("div");
    newSLLowTemp.classList.add("sl_low");
    newSLLowTemp.textContent = weatherData[0][5];
    newSLHighLow.append(newSLLowTemp);
}

// Updates weather to the appropriate location
async function updateWeather(weatherData) {
    // Updated Main Weather variables
    for (let i = 0; i < weatherData[1].length; i++) {
        mainWeatherVariablesCollection[i].textContent = weatherData[1][i];
    }

    // Updated Hourly Forecast variables
    hourlyForecastVariablesCollection[0].forEach((hf, index) => {
        hf.textContent = weatherData[2][index][0];
    });
    
    hourlyForecastVariablesCollection[1].forEach((hf, index) => {
        hf.textContent = getWeatherSymbol(weatherData[2][index][1]);
    });

    hourlyForecastVariablesCollection[2].forEach((hf, index) => {
        hf.textContent = weatherData[2][index][2];
    });

    hourlyForecastVariablesCollection[3].forEach((hf, index) => {
        hf.textContent = weatherData[2][index][3];
    });

    // Updated Weekly Forecast variables
    weeklyForecastVariablesCollection[0].forEach((wf, index) => {
        wf.textContent = getWeatherSymbol(weatherData[3][index][0]);
    });

    weeklyForecastVariablesCollection[1].forEach((wf, index) => {
        wf.textContent = weatherData[3][index][1];
    });

    weeklyForecastVariablesCollection[2].forEach((wf, index) => {
        wf.textContent = weatherData[3][index][2].charAt(0).toUpperCase() + weatherData[3][index][2].slice(1);
    });
    
    weeklyForecastVariablesCollection[3].forEach((wf, index) => {
        wf.textContent = weatherData[3][index][3];
    });

    weeklyForecastVariablesCollection[4].forEach((wf, index) => {
        wf.textContent = weatherData[3][index][4];
    });

    weeklyForecastVariablesCollection[5].forEach((wf, index) => {
        wf.textContent = weatherData[3][index][5];
    });

    // Updated Weather Conditions variables
    for (let i = 0; i < weatherData[4].length; i++) {
        if (i !== 1) {
            weatherConditionsVariablesCollection[i].textContent = weatherData[4][i];
        } else {
            rotateArrow(weatherData[4][i]);
        }
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

// Same as the function above but without the minutes
function convertTimeFormatShort(originalTime) {
    let hours = Math.ceil(originalTime.split(":").join("."));
    let unit = hours < 12 ? "AM" : "PM";
    if (hours != 12 && hours != 0) {
        hours = hours % 12;
    } else {
        hours = 12;
    }
    return `${hours} ${unit}`;
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

// Changes rotates arrow based on wind direction
function rotateArrow(windDirection) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    directions.forEach((value, index) => {
        if (value === windDirection) {
            let rotation = 22.5 * index;
            windArrow.style.transform = `rotate(${rotation}deg)`;
        }
    });
}

// Returns weather emojis based on the sky condition
function getWeatherSymbol(skyCondition) {
    if (skyCondition.includes("thunder")) {
        return "⛈️";
    } else if (skyCondition.includes("sunny")) {
        return "☀️";
    } else if (skyCondition.includes("clear")) {
        return "🌙";
    } else if (skyCondition.includes("partly cloudy")) {
        return "🌤️";
    } else if (skyCondition.includes("cloudy")) {
        return "⛅";
    } else if (skyCondition.includes("overcast")) {
        return "☁️";
    } else if (skyCondition.includes("fog") || skyCondition.includes("mist")) {
        return "🌫️";
    } else if (skyCondition.includes("rain") || skyCondition.includes("drizzle")) {
        return "🌧️";
    } else if (skyCondition.includes("snow") || skyCondition.includes("sleet") || skyCondition.includes("blizzard") || skyCondition.includes("ice")) {
        return "🌨️";
    } else {
        return "❔";
    }
}