import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../css/details.css'
import { getAirPolution, getCurrentWeather, getForecast } from '../ultilities/api/api'
import CurrentWeather from '../components/comps/currentweather'
import AirPollution from '../components/comps/airpollution'
import Forecast from '../components/comps/forecast'
import UVIndex from '../components/comps/uvindex'
import WeatherMap from '../components/comps/weathermap';

const WeatherDetails = () => {
    const [cityData, setCityData] = useState(null)
    const [forecast, setForecast] = useState([])
    const [airPollution, setAirPollution] = useState(null)

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const lat = searchParams.get("lat");
    const long = searchParams.get("long");
    const cityName = searchParams.get("city")

    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current weather
                const weatherResponse = await getCurrentWeather(lat, long)
                const weatherData = await weatherResponse.data
                setCityData(weatherData)

                // Fetch 5-day forecast 
                const forecastResponse = await getForecast(lat, long)
                const forecastData = await forecastResponse.data
                setForecast(forecastData.list.filter((item, index) => index % 8 === 0))

                // Fetch air pollution data
                const pollutionResponse = await getAirPolution(lat, long)
                const pollutionData = await pollutionResponse.data
                setAirPollution(pollutionData.list[0])

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        if (lat && long) {
            fetchData()
        }
    }, [lat, long])

    const getUVIndexAdvice = (uvIndex) => {
        if (uvIndex <= 2) return "Low risk. No protection required."
        if (uvIndex <= 5) return "Moderate risk. Wear sunscreen and sunglasses."
        if (uvIndex <= 7) return "High risk. Wear sunscreen, sunglasses, and a hat."
        if (uvIndex <= 10) return "Very high risk. Take extra precautions and limit sun exposure."
        return "Extreme risk. Avoid sun exposure and stay indoors if possible."
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
                    <CurrentWeather cityData = {cityData}/>

                    {/* <!-- Air Quality Section --> */}
                    <AirPollution airPollution={airPollution}/>
                </div>

                {/* <!-- Placeholder for other sections --> */}
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* <!-- 5 Day Forecast Section (Placeholder) --> */}
                    <Forecast forecast={forecast}/>

                    {/* <!-- UV Index Section (Placeholder) --> */}
                    <UVIndex cityData={cityData}/>

                    {/* <!-- Weather Map Section (Placeholder) --> */}
                    <WeatherMap lat={lat} long={long} cityName={cityName}/>

                </div>
            </div>
        </div>
    );
}
export default WeatherDetails