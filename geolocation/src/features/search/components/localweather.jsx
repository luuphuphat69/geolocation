import { useEffect, useState } from "react";
import "../../../css/search.css";
import { getCurrentWeather, reverseGeocoding, getForecast } from "../../../utilities/api/api";
import { kelvinToCelsius, getCurrentTimeHHMM, kelvinToFahrenheit, celsiusToFahrenheit, formatDate, formatUnixToLocalHHMM } from "../../../utilities/common";
import LottieAnimation from "../../../components/ui/lottieAnimation";
import { getLottieForCondition } from '../../../utilities/lottieUtilities';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAppOptions } from "../../../AppOptionsContext";

export const LocalWeather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const { isCelciusUnit, setIsCelciusUnit } = useAppOptions();

  useEffect(() => {
    fetchWeather();
  }, [lat, lon]);

  const fetchWeather = async () => {
    let latitude = lat;
    let longitude = lon;

    if (!latitude || !longitude) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (err) {
        console.error("Geolocation failed:", err);
        setErrorMsg("Location access is required to show your local weather.");
        return;
      }
    }

    try {
      setErrorMsg("");
      setWeather(null);
      setForecast(null);

      const weatherData = await getCurrentWeather(latitude, longitude);
      setWeather(weatherData.data);
      setCondition(weatherData.data.current.weather[0].description);

      const citydata = await reverseGeocoding(latitude, longitude);
      setCity(citydata.data);

      const forecastResponse = await getForecast(latitude, longitude);
      const forecastData = forecastResponse.data;
      setForecast(forecastData.list.filter((item, index) => index % 8 === 0));

      setLocalTime(getCurrentTimeHHMM());
    } catch (error) {
      console.error("Failed to fetch weather:", error);
      setErrorMsg("Unable to load weather right now.");
    }
  };

  const handleRefresh = () => {
    fetchWeather();
  };

  // helpers
  const getMiniIcon = (condition = "") => {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("shower")) return "🌧️";
    if (c.includes("cloud")) return "☁️";
    if (c.includes("sunny") || c.includes("clear")) return "☀️";
    return "⛅";
  };

  if (errorMsg) {
    return (
      <div id="currentTempCard" className="current-temp theme-mild">
        <div className="p-4 text-center text-sm text-gray-700">{errorMsg}</div>
      </div>
    );
  }

  if (!weather || !forecast) {
    return (
      <div id="currentTempCard" className="current-temp theme-cloud">
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  const rawTempK = weather.current.temp;
  const displayTemp = isCelciusUnit
    ? kelvinToCelsius(rawTempK)
    : kelvinToFahrenheit(rawTempK);

  const feelLikeTemp = weather.current.feels_like;
  const displayFeelslike = isCelciusUnit ? kelvinToCelsius(feelLikeTemp) : kelvinToFahrenheit(feelLikeTemp);
  const icon = getMiniIcon(condition);
  const sunrise = formatUnixToLocalHHMM(weather.current.sunrise, weather.timezone_offset);
  const sunset = formatUnixToLocalHHMM(weather.current.sunset, weather.timezone_offset);

  return (
    <div className="search-page-weather-grid">
      <div className="search-page-card">
        <div className="search-page-flex search-page-items-center search-page-justify-between search-page-mb-2">
          <div><span className="search-page-label-text">Current Location</span>
            <h2 className="search-page-section-heading" id="currentCity">{city[0]?.name + " - " + city[0]?.state || "Your Location"}</h2>
          </div>
          <div className="search-page-status-badge ml-4" id="lastUpdated">
            Last updated: {localTime}
          </div>
        </div>
        <div className="search-page-flex search-page-items-center search-page-gap-2 search-page-mb-3">
          <div className="search-page-weather-icon" id="currentIcon">
            {icon}
          </div>
          <div>
            <div className="search-page-temperature-display" id="currentTemp">
              {displayTemp}°{isCelciusUnit ? "C" : "F"}
            </div>
            <p className="search-page-label-text ml-2" id="currentCondition">{condition}</p>
          </div>
        </div>
        <div className="search-page-flex search-page-gap-2">
          <button
            className="search-page-secondary-btn"
            id="refreshBtn"
            onClick={() => {
              setWeather(null);
              setForecast(null);
              handleRefresh();
            }}
          >
            Refresh Data
          </button>
          <button className="search-page-secondary-btn" id="toggleUnit" onClick={() => setIsCelciusUnit(!isCelciusUnit)}> Switch to ° {isCelciusUnit ? "C" : "F"} </button>
        </div>
      </div>
      <div className="search-page-card-accent"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Weather Details</span>
        <div className="search-page-mt-2">
          <div className="search-page-mb-2"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Humidity</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="humidity">
              {weather?.current.humidity}%
            </div>
          </div>
          <div className="search-page-mb-2"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Wind Speed</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="windSpeed">
              {weather?.current.wind_speed} mph
            </div>
          </div>
          <div className="search-page-mb-2"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Visibility</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="visibility">
              {weather?.current.visibility} m
            </div>
          </div>
          <div><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Feels like</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="visibility">
              {displayFeelslike}°{isCelciusUnit ? "C" : "F"}
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <h3 className="search-page-section-heading search-page-mb-2">5-Day Forecast</h3>
        <div className="search-page-forecast-grid" id="forecastContainer">
          {forecast?.map((day, index) => {
            const temp = isCelciusUnit
              ? `${day.main.temp}°C`
              : `${celsiusToFahrenheit(day.main.temp)}°F`;

            return (
              <div
                key={index}
                className="search-page-forecast-card"
              >
                <div className="search-page-label-text search-page-mb-1">{formatDate(day.dt_txt)}</div>
                <div className="search-page-flex search-page-items-center search-page-justify-center">
                <LottieAnimation
                  animationData={getLottieForCondition(day.weather[0].description)}
                  width={200}
                  height={200}
                />
                </div>
                <div className="search-page-label-text search-page-mb-1">{day.weather[0].description}</div>
                <div className="search-page-flex search-page-items-center search-page-justify-center">
                  <span className="search-page-temp-high" >{temp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="search-page-card-accent"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Weather Details</span>
        <div className="search-page-mt-2">
          <div className="search-page-mb-2"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>UV Index</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="uvIndex">
              {weather?.current.uvi}
            </div>
          </div>
          <div className="search-page-mb-2"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Pressure</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="pressure">
              {weather?.current.pressure} hPa
            </div>
          </div>
          <div className="search-page-mb-2"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Sun rise</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="sunrise">
              {sunrise}
            </div>
          </div>
          <div className="search-page-mb-2"><span className="search-page-label-text" style={{ color: "rgba(250,250,250,0.8)" }}>Sun set</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800 }} id="sunset">
              {sunset}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};