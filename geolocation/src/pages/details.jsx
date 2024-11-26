import { useState, useEffect } from 'react'
import { Thermometer, Droplets, Wind, CloudRain, Shirt, Stethoscope, Shield, Sun } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocation } from 'react-router-dom'
import { Progress } from "@/components/ui/progress"
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet'

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
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">{cityName} Weather Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Current Weather</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-6xl font-bold">{Math.round(cityData.current.temp - 273.15)}°C</p>
                <p className="text-2xl">{cityData.current.weather[0].description}</p>
              </div>
              <img src={'https://openweathermap.org/img/wn/' + cityData.current.weather[0].icon + '@2x.png'} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <Thermometer className="mr-2 text-red-300" />
                <span>Feels like: {Math.round(cityData.current.feels_like - 273.15)}°C</span>
              </div>
              <div className="flex items-center">
                <Droplets className="mr-2 text-blue-300" />
                <span>Humidity: {cityData.current.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="mr-2 text-gray-300" />
                <span>Wind: {cityData.current.wind_speed} m/s</span>
              </div>
              <div className="flex items-center">
                <CloudRain className="mr-2 text-indigo-300" />
                <span>Pressure: {cityData.current.pressure} hPa</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Shirt className="mr-2" />
                Recommended Outfit
              </h3>
              <p>{getRecommendedOutfit(cityData.current.temp, cityData.current.weather[0].description)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Air Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-2">
              {getAQIDescription(airPollution.main.aqi)}
            </p>
            <Progress value={airPollution.main.aqi * 20} className="mb-4 h-3" indicatorClassName={getAQIColor(airPollution.main.aqi)} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg">PM2.5: <span className="font-bold">{airPollution.components.pm2_5.toFixed(2)}</span></p>
                <p className="text-lg">PM10: <span className="font-bold">{airPollution.components.pm10.toFixed(2)}</span></p>
              </div>
              <div>
                <p className="text-lg">NO2: <span className="font-bold">{airPollution.components.no2.toFixed(2)}</span></p>
                <p className="text-lg">O3: <span className="font-bold">{airPollution.components.o3.toFixed(2)}</span></p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Stethoscope className="mr-2" />
                Air Quality Recommendation
              </h3>
              <p>{getAQIRecommendation(airPollution.main.aqi)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                <p className="font-bold text-lg">{formatDate(day.dt_txt)}</p>
                <div className="flex justify-center">
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="Weather icon" />
                </div>
                <p className="text-2xl font-bold mt-2">{Math.round(day.main.temp)}°C</p>
                <p className="text-sm">{day.weather[0].description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">UV Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-6xl font-bold">{cityData.current.uvi}</p>
              <p className="text-2xl">{getUVIndexAdvice(cityData.current.uvi).split('.')[0]}</p>
            </div>
            <Shield className="w-16 h-16" />
          </div>
          <Progress value={cityData.current.uvi * 10} className="mb-4 h-3" />
          <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <Sun className="mr-2" />
              Sun Protection Advice
            </h3>
            <p>{getUVIndexAdvice(cityData.current.uvi)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Weather Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[650px] w-full rounded-lg overflow-hidden">
            <MapContainer center={[lat, long]} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Temperature">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                    attribution="&copy; OpenWeatherMap"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Wind">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                    attribution="&copy; OpenWeatherMap"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Clouds">
                  <TileLayer
                    url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                    attribution="&copy; OpenWeatherMap"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              <Marker position={[lat, long]}>
                <Popup>{cityName} Weather</Popup>
              </Marker>
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}