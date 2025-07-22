import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet'
import '../../css/weathermap.css'

const WeatherMap = ({ lat, long, cityName }) => {
    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    return (
        <section class="weather-map-card md:col-span-2">
            <div class="card-header">
                <h2 class="text-xl font-semibold text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Weather Map
                </h2>
            </div>
            <div class="card-content">
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
            <div class="fade-bottom"></div>
        </section>
    );
}
export default WeatherMap;