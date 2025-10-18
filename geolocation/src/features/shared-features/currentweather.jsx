import { kelvinToCelsius, kelvinToFahrenheit } from "../../utilities/common";
import { useAppOptions } from "../../AppOptionsContext";
import { Loader2 } from "lucide-react";
import '../../css/currentweather.css'

const CurrentWeather = ({ cityData }) => {
    const { isCelciusUnit, setIsCelciusUnit } = useAppOptions();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const getRecommendedOutfit = (temp) => {
        const celsiusTemp = temp - 273.15;

        if (celsiusTemp < 10) return "Heavy coat, scarf, and gloves";
        if (celsiusTemp < 20) return "Light jacket or sweater";
        if (celsiusTemp < 30) return "T-shirt and light pants";
        if (celsiusTemp <= 39) return "Shorts and a breathable shirt, stay hydrated";
        if (celsiusTemp <= 50)
            return "Very hot! Wear loose, light-colored clothes and avoid outdoor activities";
        if (celsiusTemp > 50)
            return "Extreme heat! Stay indoors with air conditioning if possible";
        return "Light, breathable clothing";
    };

    const handleUnitClick = (unit) => {
        const toCelsius = unit === "C";
        if (toCelsius !== isCelciusUnit) setIsCelciusUnit(toCelsius);
    };

    if (!cityData?.current) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="current-weather-card ">
            {/* Header */}
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3 text-black">
                <img
                    src={`https://openweathermap.org/img/wn/${cityData.current.weather[0].icon}@2x.png`}
                    alt="Weather icon"
                    className="current-weather-icon"
                />
                Current Weather
            </h2>

            {/* Temperature + Unit + Description + Date */}
            <div className="border-2 border-black p-4 rounded-lg bg-white shadow-[3px_3px_0_0_#000]">
                <div className="flex flex-col">
                    {/* Top row: Temperature */}
                    <div className="flex items-center justify-start mb-4">
                        <div className="text-6xl font-extrabold text-black">
                            {isCelciusUnit
                                ? `${kelvinToCelsius(cityData.current.temp)}°C`
                                : `${kelvinToFahrenheit(cityData.current.temp)}°F`}
                        </div>
                    </div>

                    {/* Middle row: C/F toggle + description */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-left">
                        {/* Description */}
                        <div className="text-lg font-medium text-gray-800">
                            {cityData.current.weather[0].description
                                .split(" ")
                                .map((w) => w[0].toUpperCase() + w.slice(1))
                                .join(" ")}
                        </div>

                        {/* C/F toggle */}
                        <div className="text-sm text-gray-700 mb-2 sm:mb-0 space-x-1">
                            <button
                                onClick={() => handleUnitClick("C")}
                                className={`font-bold ${isCelciusUnit ? "active" : "text-gray-500"}`}
                            >
                                °C
                            </button>
                            |
                            <button
                                onClick={() => handleUnitClick("F")}
                                className={`font-bold ${!isCelciusUnit ? "active" : "text-gray-500"}`}
                            >
                                °F
                            </button>
                        </div>
                    </div>

                    {/* Bottom row: Date/time centered */}
                    <div className="mt-4 text-center text-gray-600 font-medium text-sm">
                        {formatDate(new Date())}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                    ["Feels Like", cityData.current.feels_like],
                    ["Humidity", `${cityData.current.humidity}%`],
                    ["Wind Speed", `${cityData.current.wind_speed} m/s`],
                    ["Pressure", `${cityData.current.pressure} hPa`],
                ].map(([label, value], i) => (
                    <div
                        key={i}
                        className="bg-white border-2 border-black rounded-lg p-4 shadow-[3px_3px_0_0_#000] text-center"
                    >
                        <div className="text-sm text-gray-600">{label}</div>
                        <div className="text-xl font-bold text-black mt-1">
                            {label === "Feels Like"
                                ? isCelciusUnit
                                    ? `${kelvinToCelsius(value)}°C`
                                    : `${kelvinToFahrenheit(value)}°F`
                                : value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Outfit Recommendation */}
            <div className="mt-6 border-2 border-black bg-white p-4 rounded-lg shadow-[4px_4px_0_0_#000]">
                <h3 className="font-bold text-black mb-3">Outfit Recommendation</h3>
                <div className="flex flex-row items-start" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-gray-800 font-medium">
                            {getRecommendedOutfit(cityData.current.temp)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;