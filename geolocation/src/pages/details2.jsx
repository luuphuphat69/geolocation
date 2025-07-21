import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const WeatherDetails = () => {
    const [cityData, setCityData] = useState(null)
    const [forecast, setForecast] = useState([])
    const [airPollution, setAirPollution] = useState(null)
    const [currentUnit, setCurrentUnit] = useState('C');

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const lat = searchParams.get("lat");
    const long = searchParams.get("long");
    const cityName = searchParams.get("city")
    const currentDate = new Date();

    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current weather
                const weatherResponse = await fetch(`http://localhost:3000/v1/weather/current?lat=${lat}&long=${long}`)
                const weatherData = await weatherResponse.json()
                setCityData(weatherData)

                // Fetch 5-day forecast
                const forecastResponse = await fetch(`http://localhost:3000/v1/weather/forecast?lat=${lat}&long=${long}`)
                const forecastData = await forecastResponse.json()
                setForecast(forecastData.list.filter((item, index) => index % 8 === 0))

                // Fetch air pollution data
                const pollutionResponse = await fetch(`http://localhost:3000/v1/weather/airpollution?lat=${lat}&long=${long}`)
                const pollutionData = await pollutionResponse.json()
                setAirPollution(pollutionData.list[0])
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        if (lat && long) {
            fetchData()
        }
    }, [lat, long])

    const kelvinToCelsius = (k) => Math.round(k - 273.15);
    const kelvinToFahrenheit = (k) => Math.round((k * 9) / 5 - 459.67);
    const handleUnitClick = (unit) => {
        if (unit === currentUnit) return;

        setCurrentUnit(unit);
    };

    const getAQIDescription = (aqi) => {
        const descriptions = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
        return descriptions[aqi - 1] || 'Unknown'
    }

    const getAQIColor = (aqi) => {
        const colors = ["bg-green-500", "bg-yellow-400", "bg-orange-400", "bg-red-500", "bg-purple-600"]
        return colors[aqi - 1] || colors[0]
    }

    const getAQIRecommendation = (aqi) => {
        switch (aqi) {
            case 1:
                return "Air quality is excellent. Enjoy outdoor activities!"
            case 2:
                return "Air quality is acceptable. Sensitive individuals should consider reducing prolonged outdoor exertion."
            case 3:
                return "Members of sensitive groups may experience health effects. The general public is less likely to be affected."
            case 4:
                return "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects."
            case 5:
                return "Health alert: The risk of health effects is increased for everyone. Avoid outdoor activities."
            default:
                return "No recommendation available."
        }
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

    const getUVIndexAdvice = (uvIndex) => {
        if (uvIndex <= 2) return "Low risk. No protection required."
        if (uvIndex <= 5) return "Moderate risk. Wear sunscreen and sunglasses."
        if (uvIndex <= 7) return "High risk. Wear sunscreen, sunglasses, and a hat."
        if (uvIndex <= 10) return "Very high risk. Take extra precautions and limit sun exposure."
        return "Extreme risk. Avoid sun exposure and stay indoors if possible."
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }

    if (!cityData || !forecast.length || !airPollution) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }
    return (
        <div class="min-h-screen p-4 md:p-6">
            <div class="max-w-6xl mx-auto">
                <header class="mb-6">
                    <h1 class="text-3xl md:text-4xl font-bold text-blue-800">Weather Details</h1>
                    <div class="flex items-center mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                        </svg>
                        <span class="ml-1 text-blue-700">{cityName}</span>
                    </div>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* <!-- Current Weather Section --> */}
                    <section class="weather-card p-6">
                        <h2 class="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            Current Weather
                        </h2>

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
                                <div class="mt-2 text-sm text-gray-600">{currentDate.toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                })}</div>
                            </div>
                            <div class="mt-4 md:mt-0">
                                <svg class="h-24 w-24 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                                    <defs>
                                        <linearGradient id="a" x1="16.5" y1="19.67" x2="21.5" y2="28.33" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stop-color="#fbbf24" />
                                            <stop offset="0.45" stop-color="#fbbf24" />
                                            <stop offset="1" stop-color="#f59e0b" />
                                        </linearGradient>
                                        <linearGradient id="b" x1="22.56" y1="21.96" x2="39.2" y2="50.8" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stop-color="#f3f7fe" />
                                            <stop offset="0.45" stop-color="#f3f7fe" />
                                            <stop offset="1" stop-color="#deeafb" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="19" cy="24" r="5" fill="url(#a)" />
                                    <path d="M46.5,31.5l-.32,0a10.49,10.49,0,0,0-19.11-8,7,7,0,0,0-10.57,6,7.21,7.21,0,0,0,.1,1.14A7.5,7.5,0,0,0,18,45.5a4.19,4.19,0,0,0,.5,0h28a7,7,0,0,0,0-14Z" fill="url(#b)" stroke="#e6effc" stroke-miterlimit="10" stroke-width="0.5" />
                                </svg>
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
                    </section>

                    {/* <!-- Air Quality Section --> */}
                    <section class="weather-card p-6">
                        <h2 class="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Air Quality
                        </h2>

                        <div class="flex items-center mb-4">
                            <div class="w-16 h-16 rounded-full flex items-center justify-center air-quality-moderate mr-4">
                                <span class="text-white text-2xl font-bold">52</span>
                            </div>
                            <div>
                                <div class="text-xl font-semibold">Moderate</div>
                                <div class="text-sm text-gray-600">Air quality is acceptable</div>
                            </div>
                        </div>

                        <div class="bg-gray-100 h-2 rounded-full mb-4">
                            <div class="h-2 rounded-full w-1/2 air-quality-moderate"></div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="bg-white p-3 rounded-lg shadow-sm">
                                <div class="text-sm text-gray-500">PM2.5</div>
                                <div class="text-xl font-semibold">12 µg/m³</div>
                            </div>
                            <div class="bg-white p-3 rounded-lg shadow-sm">
                                <div class="text-sm text-gray-500">PM10</div>
                                <div class="text-xl font-semibold">28 µg/m³</div>
                            </div>
                            <div class="bg-white p-3 rounded-lg shadow-sm">
                                <div class="text-sm text-gray-500">NO₂</div>
                                <div class="text-xl font-semibold">15 ppb</div>
                            </div>
                            <div class="bg-white p-3 rounded-lg shadow-sm">
                                <div class="text-sm text-gray-500">O₃</div>
                                <div class="text-xl font-semibold">48 ppb</div>
                            </div>
                        </div>

                        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 class="font-medium text-yellow-800 mb-2">Air Quality Recommendation</h3>
                            <div class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                                <p class="text-gray-700">Unusually sensitive individuals should consider reducing prolonged outdoor activities.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* <!-- Placeholder for other sections --> */}
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* <!-- 5 Day Forecast Section (Placeholder) --> */}
                    <section class="weather-card p-6 md:col-span-3">
                        <h2 class="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            5 Day Forecast
                        </h2>
                        <div class="text-center text-gray-500">5 Day Forecast will be implemented next</div>
                    </section>

                    {/* <!-- UV Index Section (Placeholder) --> */}
                    <section class="weather-card p-6">
                        <h2 class="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            UV Index
                        </h2>
                        <div class="text-center text-gray-500">UV Index will be implemented next</div>
                    </section>

                    {/* <!-- Weather Map Section (Placeholder) --> */}
                    <section class="weather-card p-6 md:col-span-2">
                        <h2 class="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Weather Map
                        </h2>
                        <div class="text-center text-gray-500">Weather Map will be implemented next</div>
                    </section>
                </div>
            </div>
        </div>
    );
}
export default WeatherDetails