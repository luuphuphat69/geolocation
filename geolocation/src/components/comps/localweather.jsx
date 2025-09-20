import { useEffect, useState } from "react";
import "../../css/localweather.css";
import { getCurrentWeather, reverseGeocoding } from "../../utilities/api/api";
import { kelvinToCelsius, getCurrentTimeHHMMSS, kelvinToFahrenheit } from "../../utilities/common";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useAppOptions } from "../../AppOptionsContext";

export const LocalWeather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const { isCelciusUnit, setIsCelciusUnit } = useAppOptions();

  useEffect(() => {
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
        const weatherData = await getCurrentWeather(latitude, longitude);
        const citydata = await reverseGeocoding(latitude, longitude);

        setWeather(weatherData.data);
        setCity(citydata.data);
        setCondition(weatherData.data.current.weather[0].description);
        setLocalTime(getCurrentTimeHHMMSS());
      } catch (error) {
        console.error("Failed to fetch weather:", error);
        setErrorMsg("Unable to load weather right now.");
      }
    };

    fetchWeather();
  }, [lat, lon]);

  // helpers
  const getMiniIcon = (condition = "") => {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("shower")) return "🌧️";
    if (c.includes("cloud")) return "☁️";
    if (c.includes("sunny") || c.includes("clear")) return "☀️";
    return "⛅";
  };

  const pickTheme = (temp, condition = "") => {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("shower")) return "theme-rain";
    if (c.includes("cloud")) return "theme-cloud";
    if (c.includes("sunny") || c.includes("clear")) {
      if (temp >= 88) return "theme-hot";
      if (temp >= 72) return "theme-warm";
      if (temp >= 55) return "theme-mild";
      return "theme-cold";
    }
    if (temp >= 90) return "theme-hot";
    if (temp >= 72) return "theme-warm";
    if (temp >= 55) return "theme-mild";
    return "theme-cold";
  };

  if (errorMsg) {
    return (
      <div id="currentTempCard" className="current-temp theme-mild">
        <div className="p-4 text-center text-sm text-gray-700">{errorMsg}</div>
      </div>
    );
  }

  if (!weather) {
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
  const theme = pickTheme(displayTemp, condition);
  const icon = getMiniIcon(condition);

  return (
    <div id="currentTempCard" className={`current-temp ${theme}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 rounded-full bg-white/20 border border-white/40 items-center justify-center shrink-0">
          <span id="currentTempIcon" className="text-white text-lg">
            {icon}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              id="currentTempCity"
              className="text-xs uppercase tracking-wider opacity-95"
            >
              {city[0].name + " - " + city[0].state || "Your Location"}
            </p>
            <button
              id="unitToggleBtn"
              className="inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/50 px-2.5 py-1 text-xs font-semibold transition"
              title="Switch units"
              onClick={() => setIsCelciusUnit(!isCelciusUnit)}
            >
              °{isCelciusUnit ? "C" : "F"}
            </button>
            <button
              id="refreshTempBtn"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 border border-white/50 p-2 transition"
              title="Refresh"
            >
              <i className="fa fa-refresh"></i>
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              id="currentTempValue"
              className="text-3xl font-extrabold"
            >
              {displayTemp}°{isCelciusUnit ? "C" : "F"}
            </span>
            <span
              id="currentTempCondition"
              className="text-sm opacity-95"
            >
              {condition}
            </span>
          </div>
          <p
            id="currentTempUpdated"
            className="text-[11px] opacity-90 mt-1"
          >
            Last updated: {localTime}
          </p>
        </div>
      </div>
    </div>
  );
};