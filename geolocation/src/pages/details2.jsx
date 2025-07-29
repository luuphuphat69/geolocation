import { useLocation } from 'react-router-dom'
import { useState, useEffect} from 'react'
import '../css/details.css'
import { getAirPolution, getCurrentWeather, getForecast } from '../ultilities/api/api'
import CurrentWeather from '../components/comps/currentweather'
import AirPollution from '../components/comps/airpollution'
import Forecast from '../components/comps/forecast'
import UVIndex from '../components/comps/uvindex'
import WeatherMap from '../components/comps/weathermap'

const getWeatherType = (id) => {
    if (id >= 200 && id < 300) return "thunderstorm";
    if (id >= 300 && id < 400) return "drizzle";
    if (id >= 500 && id < 600) return "rain";
    if (id >= 600 && id < 700) return "snow";
    if (id >= 700 && id < 800) return "atmosphere";
    if (id === 800) return "clear";
    if (id > 800 && id < 900) return "clouds";
    return "unknown";
};


const WeatherDetails = () => {
    const [cityData, setCityData] = useState(null)
    const [forecast, setForecast] = useState([])
    const [airPollution, setAirPollution] = useState(null)
    const [weatherType, setWeatherType] = useState(null);


    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);
    const lat = searchParams.get("lat");
    const long = searchParams.get("long");
    const cityName = searchParams.get("city")

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

    useEffect(() => {
        const id = cityData?.current?.weather?.[0]?.id;
        if (!id) return;

        setWeatherType(getWeatherType(id));
    }, [cityData]);
    useEffect(() => {
        if (!weatherType) return;

        const observer = new MutationObserver(() => {
            const container = document.getElementById('weather-particles');
            if (container) {
                createWeatherParticles(weatherType);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [weatherType]);

    if (!cityData || !forecast.length || !airPollution) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    function createWeatherParticles(weatherType) {
        const particlesContainer = document.getElementById('weather-particles');
        if (!particlesContainer) return;

        particlesContainer.innerHTML = '';

        if (weatherType === 'rain' || weatherType === 'thunderstorm' || weatherType === 'drizzle') {
            for (let i = 0; i < 50; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = Math.random() * 100 + '%';
                drop.style.animationDelay = Math.random() * 1 + 's';
                drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                particlesContainer.appendChild(drop);
            }
        } else if (weatherType === 'snow') {
            for (let i = 0; i < 30; i++) {
                const flake = document.createElement('div');
                flake.className = 'snow-flake';
                flake.innerHTML = '❄';
                flake.style.left = Math.random() * 100 + '%';
                flake.style.animationDelay = Math.random() * 3 + 's';
                flake.style.fontSize = (Math.random() * 10 + 10) + 'px';
                particlesContainer.appendChild(flake);
            }
        } else if (weatherType === 'clouds' || weatherType === 'atmosphere') {
            for (let i = 0; i < 3; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud-particle';
                cloud.style.width = (Math.random() * 100 + 50) + 'px';
                cloud.style.height = (Math.random() * 30 + 20) + 'px';
                cloud.style.top = Math.random() * 30 + '%';
                cloud.style.animationDelay = Math.random() * 20 + 's';
                cloud.style.animationDuration = (Math.random() * 10 + 15) + 's';
                particlesContainer.appendChild(cloud);
            }
        }
    }

    return (
        <>
            {/* Weather background overlay */}
            <div
                className={`weather-particles ${(() => {
                    const id = cityData?.current?.weather?.[0]?.id;
                    if (!id) return "";
                    if (id >= 200 && id < 300) return "weather-thunderstorm";
                    if (id >= 300 && id < 400) return "weather-drizzle";
                    if (id >= 500 && id < 600) return "weather-rain";
                    if (id >= 600 && id < 700) return "weather-snow";
                    if (id >= 700 && id < 800) return "weather-atmosphere";
                    if (id === 800) return "weather-clear";
                    if (id > 800 && id < 900) return "weather-clouds";
                    return "";
                })()}`}
                id="weather-particles"
            />

            {/* Main content */}
            <div className="min-h-screen p-4 md:p-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">Weather Details</h1>
                        <div className="flex items-center mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-1 text-blue-700">{cityName}</span>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CurrentWeather cityData={cityData} />
                        <AirPollution airPollution={airPollution} />
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Forecast forecast={forecast} />
                        <UVIndex cityData={cityData} />
                        <WeatherMap lat={lat} long={long} cityName={cityName} />
                    </div>
                </div>
            </div>
        </>
    );
}
export default WeatherDetails