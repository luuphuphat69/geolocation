import { useState, useEffect } from "react";

const CurrentWeather = ({ cityData }) => {
    
    const [currentUnit, setCurrentUnit] = useState('C');
    const kelvinToCelsius = (k) => Math.round((k - 273.15) * 10) / 10;
    const kelvinToFahrenheit = (k) => Math.round(((k * 9) / 5 - 459.67) * 10) / 10;

    const currentDate = new Date();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        })
    }
    const getRecommendedOutfit = (temp) => {
        const celsiusTemp = temp - 273.15;
        if (celsiusTemp < 10) {
            return "Heavy coat, scarf, and gloves"
        } else if (celsiusTemp < 20) {
            return "Light jacket or sweater"
        } else if (celsiusTemp < 30) {
            return "T-shirt and light pants"
        } else {
            return "Light, breathable clothing"
        }
    }
    const handleUnitClick = (unit) => {
        if (unit === currentUnit) return;
        setCurrentUnit(unit);
    };
    if (!cityData?.current) {
        return <p>Loading weather data...</p>;
    }
    return (
        <div class="weather-card p-6">
            <h2 class="text-xl font-semibold mb-4 text-blue-800 flex items-center">
            <img src={`https://openweathermap.org/img/wn/${cityData.current.weather[0].icon}@2x.png`} alt="Weather icon" />
                Current Weather
            </h2>

            <div className='card-content'>
                <div class="flex flex-col md:flex-row items-center">
                    <div class="flex-1 text-center md:text-left">
                        <div class="flex items-center justify-center md:justify-start">
                            <div class="text-6xl font-bold text-blue-700">
                                {currentUnit === 'C'
                                    ? `${kelvinToCelsius(cityData.current.temp)}°C`
                                    : `${kelvinToFahrenheit(cityData.current.temp)}°F`}

                            </div>
                            <div class="ml-2">
                                <div class="text-sm text-gray-500 unit-toggle" id="unit-toggle">
                                    <span id="fahrenheit" class="inactive" onClick={() => handleUnitClick('F')}>°F</span> |
                                    <span id="celsius" class="active" onClick={() => handleUnitClick('C')}>°C</span>
                                </div>
                                <div class="text-lg font-medium">{cityData.current.weather[0].description}</div>
                            </div>
                        </div>
                        <div class="mt-2 text-sm text-gray-600">{formatDate(currentDate)}</div>
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-sm text-gray-500">Feels Like</div>
                        <div class="text-xl font-semibold"><span id="feels-like">
                            {currentUnit === 'C'
                                ? `${kelvinToCelsius(cityData.current.feels_like)}°C`
                                : `${kelvinToFahrenheit(cityData.current.feels_like)}°F`}</span></div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-sm text-gray-500">Humidity</div>
                        <div class="text-xl font-semibold">{cityData.current.humidity}%</div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-sm text-gray-500">Wind Speed</div>
                        <div class="text-xl font-semibold">{cityData.current.wind_speed} m/s</div>
                    </div>
                    <div class="bg-blue-50 p-3 rounded-lg">
                        <div class="text-sm text-gray-500">Pressure</div>
                        <div class="text-xl font-semibold">{cityData.current.pressure} hPa</div>
                    </div>
                </div>

                <div class="mt-6 bg-blue-100 p-4 rounded-lg">
                    <h3 class="font-medium text-blue-800 mb-2">Outfit Recommendation</h3>
                    <div class="flex items-center">
                        <div class="mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-gray-700" id="outfit-recommendation">{getRecommendedOutfit(cityData.current.temp)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CurrentWeather;