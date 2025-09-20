import { kelvinToCelsius, kelvinToFahrenheit } from "../../../utilities/common";
import HourlyForecast from "../hourlyforecast";
import { useAppOptions } from "../../../AppOptionsContext";

const WeatherCard_Comp = ({ weatherData, iconUrl, hourlyForecastData }) => {
  const { isCelciusUnit, setIsCelciusUnit } = useAppOptions();

  const handleUnitClick = (unit) => {
    setIsCelciusUnit(unit === "C");
  };

  return (
    <div
      className="weather-card__section weather-card__section--active"
      data-section="weather"
    >
      <div className="weather-card__content">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="weather-card__icon text-6xl text-blue-500 mr-4">
              <img
                src={iconUrl}
                alt={weatherData.current.weather[0].description}
                className="w-16 h-16"
              />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-4xl font-bold text-gray-800">
                  {isCelciusUnit
                    ? `${kelvinToCelsius(weatherData.current.temp)}°C`
                    : `${kelvinToFahrenheit(weatherData.current.temp)}°F`}
                </h3>
                <div className="weather-card__unit-toggle ml-2">
                  <span
                    className={`weather-card__unit-option ${
                      isCelciusUnit ? "weather-card__unit-option--active" : ""
                    }`}
                    onClick={() => handleUnitClick("C")}
                  >
                    °C
                  </span>
                  <span
                    className={`weather-card__unit-option ${
                      !isCelciusUnit ? "weather-card__unit-option--active" : ""
                    }`}
                    onClick={() => handleUnitClick("F")}
                  >
                    °F
                  </span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">
                {weatherData.current.weather[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="weather-card__stat">
            <p className="text-gray-500 text-sm">Humidity</p>
            <p className="text-gray-800 font-bold text-lg">
              {weatherData.current.humidity}%
            </p>
          </div>
          <div className="weather-card__stat">
            <p className="text-gray-500 text-sm">Wind</p>
            <p className="text-gray-800 font-bold text-lg">
              {weatherData.current.wind_speed} km/h
            </p>
          </div>
          <div className="weather-card__stat">
            <p className="text-gray-500 text-sm">Feels like</p>
            <p className="text-gray-800 font-bold text-lg" id="feels-like">
              {isCelciusUnit
                ? `${kelvinToCelsius(weatherData.current.feels_like)}°C`
                : `${kelvinToFahrenheit(weatherData.current.feels_like)}°F`}
            </p>
          </div>
        </div>

        {/* Forecast preview */}
        <div className="mt-6">
          <HourlyForecast hourlyForecastData={hourlyForecastData} />
        </div>
      </div>
    </div>
  );
};

export default WeatherCard_Comp;