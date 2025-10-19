import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import '../../css/details.css';
import { getAirPolution, getCurrentWeather, getForecast } from '../../utilities/api/api';
import CurrentWeather from '../shared-features/currentweather';
import AirPollution from '../shared-features/airpollution';
import Forecast from '../shared-features/forecast';
import UVIndex from '../shared-features/uvindex';
import WeatherMap from '../shared-features/weathermap';

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
    const [cityData, setCityData] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [airPollution, setAirPollution] = useState(null);
    const [weatherType, setWeatherType] = useState(null);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const lat = searchParams.get("lat");
    const long = searchParams.get("long");
    const cityName = searchParams.get("city");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const weatherResponse = await getCurrentWeather(lat, long);
                setCityData(await weatherResponse.data);

                const forecastResponse = await getForecast(lat, long);
                const forecastData = await forecastResponse.data;
                setForecast(forecastData.list.filter((_, i) => i % 8 === 0));

                const pollutionResponse = await getAirPolution(lat, long);
                const pollutionData = await pollutionResponse.data;
                setAirPollution(pollutionData.list[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (lat && long) fetchData();
    }, [lat, long]);

    useEffect(() => {
        const id = cityData?.current?.weather?.[0]?.id;
        if (id) setWeatherType(getWeatherType(id));
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

    const createWeatherParticles = (type) => {
        const container = document.getElementById('weather-particles');
        if (!container) return;
        container.innerHTML = '';

        if (['rain', 'thunderstorm', 'drizzle'].includes(type)) {
            for (let i = 0; i < 50; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.animationDelay = `${Math.random()}s`;
                drop.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
                container.appendChild(drop);
            }
        } else if (type === 'snow') {
            for (let i = 0; i < 30; i++) {
                const flake = document.createElement('div');
                flake.className = 'snow-flake';
                flake.innerHTML = '❄';
                flake.style.left = `${Math.random() * 100}%`;
                flake.style.animationDelay = `${Math.random() * 3}s`;
                flake.style.fontSize = `${Math.random() * 10 + 10}px`;
                container.appendChild(flake);
            }
        } else if (['clouds', 'atmosphere'].includes(type)) {
            for (let i = 0; i < 3; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud-particle';
                cloud.style.width = `${Math.random() * 100 + 50}px`;
                cloud.style.height = `${Math.random() * 30 + 20}px`;
                cloud.style.top = `${Math.random() * 30}%`;
                cloud.style.animationDelay = `${Math.random() * 20}s`;
                cloud.style.animationDuration = `${Math.random() * 10 + 15}s`;
                container.appendChild(cloud);
            }
        }
    };

    if (!cityData || !forecast.length || !airPollution) {
        return <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>;
    }

    return (
        <>
            <div
                className={`weather-particles neo-bg-${weatherType || 'clear'}`}
                id="weather-particles"
            />

            <div className="min-h-screen p-4 md:p-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-6 neo-header title" style={{backgroundColor:'#ffefb3'}}>
                        <h1 className="text-4xl font-extrabold text-black-800">{cityName} Weather</h1>
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
};

export default WeatherDetails;