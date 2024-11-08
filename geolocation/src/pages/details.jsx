import { useState, useEffect } from 'react'
import { MapPin, Droplets, Wind, Thermometer, CloudRain } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocation } from 'react-router-dom'
import { Progress } from "@/components/ui/progress"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';

export default function CityWeatherDetails() {
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
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`)
        const weatherData = await weatherResponse.json()
        setCityData(weatherData)

        // Fetch 5-day forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`)
        const forecastData = await forecastResponse.json()
        setForecast(forecastData.list.filter((item, index) => index % 8 === 0))

        // Fetch air pollution data
        const pollutionResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=${API_KEY}`)
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

  const getAQIDescription = (aqi) => {
    const descriptions = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
    return descriptions[aqi - 1] || 'Unknown'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  if (!cityData || !forecast.length || !airPollution) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{cityName} Weather Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{Math.round(cityData.main.temp)}°C</p>
                <p className="text-xl">{cityData.weather[0].description}</p>
              </div>
              <img 
                src={`http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`} 
                alt={cityData.weather[0].description}
                width={100}
                height={100}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <Thermometer className="mr-2" />
                <span>Feels like: {Math.round(cityData.main.feels_like)}°C</span>
              </div>
              <div className="flex items-center">
                <Droplets className="mr-2" />
                <span>Humidity: {cityData.main.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="mr-2" />
                <span>Wind: {cityData.wind.speed} m/s</span>
              </div>
              <div className="flex items-center">
                <CloudRain className="mr-2" />
                <span>Pressure: {cityData.main.pressure} hPa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Air Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">
              {getAQIDescription(airPollution.main.aqi)}
            </p>
            <Progress value={airPollution.main.aqi * 20} className="mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>PM2.5: {airPollution.components.pm2_5.toFixed(2)}</p>
                <p>PM10: {airPollution.components.pm10.toFixed(2)}</p>
              </div>
              <div>
                <p>NO2: {airPollution.components.no2.toFixed(2)}</p>
                <p>O3: {airPollution.components.o3.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="text-center">
                <p className="font-bold">{formatDate(day.dt_txt)}</p>
                <img 
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                  alt={day.weather[0].description}
                  className="mx-auto"
                  width={50}
                  height={50}
                />
                <p>{Math.round(day.main.temp)}°C</p>
                <p className="text-sm">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weather Map</CardTitle>
        </CardHeader>
        <CardContent>
          <MapContainer
            center={[lat, long]}
            zoom={10}
            style={{ height: '400px', width: '100%' }}
          >
            {/* Base map layer */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {/* OpenWeather tile layer */}
            <TileLayer
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
              attribution="&copy; OpenWeatherMap"
            />
            {/* Marker at city location */}
            <Marker position={[lat, long]}>
              <Popup>{cityName} Weather</Popup>
            </Marker>
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  )
}