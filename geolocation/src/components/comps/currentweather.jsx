import { useState, useEffect } from "react";
import { kelvinToCelsius, kelvinToFahrenheit } from "../../utilities/common";
const CurrentWeather = ({ cityData }) => {

    const [currentUnit, setCurrentUnit] = useState('C');

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
            return "Heavy coat, scarf, and gloves";
        } else if (celsiusTemp < 20) {
            return "Light jacket or sweater";
        } else if (celsiusTemp < 30) {
            return "T-shirt and light pants";
        } else if (celsiusTemp >= 30 && celsiusTemp <= 39) {
            return "Shorts and a breathable shirt, stay hydrated";
        } else if (celsiusTemp > 39 && celsiusTemp <= 50) {
            return "Very hot! Wear loose, light-colored clothes and avoid outdoor activities";
        } else if (celsiusTemp > 50) {
            return "Extreme heat! Stay indoors with air conditioning if possible";
        } else {
            return "Light, breathable clothing";
        }
    };

    const handleUnitClick = (unit) => {
        if (unit === currentUnit) return;
        setCurrentUnit(unit);
    };
    if (!cityData?.current) {
        return <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }
    return (
        <div className="weather-card p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                <img src={`https://openweathermap.org/img/wn/${cityData.current.weather[0].icon}@2x.png`} alt="Weather icon" />
                Current Weather
            </h2>

            <div className='card-content'>
                <div className="flex flex-col md:flex-row items-center">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start">
                            <div className="text-6xl font-bold text-blue-700">
                                {currentUnit === 'C'
                                    ? `${kelvinToCelsius(cityData.current.temp)}°C`
                                    : `${kelvinToFahrenheit(cityData.current.temp)}°F`}

                            </div>
                            <div className="ml-2">
                                <div className="text-sm text-gray-500 unit-toggle" id="unit-toggle">
                                    <button id="celsius" className="active" onClick={() => handleUnitClick('C')}>°C</button> |
                                    <button id="fahrenheit" className="inactive" onClick={() => handleUnitClick('F')}>°F</button>
                                </div>
                                <div className="text-lg font-medium">{cityData.current.weather[0].description}</div>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">{formatDate(currentDate)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">Feels Like</div>
                        <div className="text-xl font-semibold"><span id="feels-like">
                            {currentUnit === 'C'
                                ? `${kelvinToCelsius(cityData.current.feels_like)}°C`
                                : `${kelvinToFahrenheit(cityData.current.feels_like)}°F`}</span></div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">Humidity</div>
                        <div className="text-xl font-semibold">{cityData.current.humidity}%</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">Wind Speed</div>
                        <div className="text-xl font-semibold">{cityData.current.wind_speed} m/s</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">Pressure</div>
                        <div className="text-xl font-semibold">{cityData.current.pressure} hPa</div>
                    </div>
                </div>

                <div className="mt-6 bg-blue-100 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Outfit Recommendation</h3>
                    <div className="flex items-center">
                        <div className="mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-700" id="outfit-recommendation">{getRecommendedOutfit(cityData.current.temp)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CurrentWeather;