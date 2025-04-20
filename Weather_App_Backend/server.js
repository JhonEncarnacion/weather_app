const app = express();
const port = 3000;
const WEATHER_API_KEY = "2a0265e0ff8f4b72881145040242110";
const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";
const CURRENT = "/current.json";
const FORECAST = "/forecast.json";
const HISTORY = "/history.json";
const MARINE = "/marine.json";
const ASTRONOMY = "/astronomy.json";

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
