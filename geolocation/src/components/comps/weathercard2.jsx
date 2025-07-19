import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Thermometer, Bell, Droplets, Wind } from "lucide-react"
import '../../css/weathercard.css'

const WeatherCard2 = ({ city, lat, long }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [localTime, setLocalTime] = useState(0);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const temper = await axios.get(`http://localhost:3000/v1/weather/current?lat=${lat}&long=${long}`)
                setWeatherData(temper.data);

                const localTimer = await axios.get(`http://api.timezonedb.com/v2.1/get-time-zone?key=CP4P4NLCRHWV&format=json&by=zone&zone=${weatherData.timezone}`)
                setLocalTime(localTimer.data.formatted);

                console.log(weatherData)
            } catch (err) {
                console.log(err);
            }
        }
        fetchWeatherData();
    }, [lat, long]);
    if (!weatherData) {
        return <p>Loading weather data...</p>
    }
    return (
        <div class="weather-app">
            <div class="weather-card">
                {/* <!-- Header with city name and local time --> */}
                <div class="weather-card__header">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-3xl font-bold">{city}</h2>
                            <p class="text-blue-100" id="local-time">Local time: {localTime}</p>
                        </div>
                        <div class="flex space-x-3">

                            <button class="weather-card__btn bg-white bg-opacity-20 rounded-full p-2 text-white hover:bg-opacity-30" id="notification-btn" title="Get notifications">
                                <Bell></Bell>
                            </button>

                            <button class="weather-card__btn bg-white bg-opacity-20 rounded-full p-2 text-white hover:bg-opacity-30" id="details-btn" title="View details">
                                <Eye></Eye>
                            </button>
                        </div>
                    </div>
                </div>

                {/* <!-- Main weather info --> */}
                <div class="weather-card__content">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <div class="weather-card__icon text-6xl text-blue-500 mr-4">
                                <i class="fas fa-cloud-sun-rain"></i>
                            </div>
                            <div>
                                <h3 class="text-4xl font-bold text-gray-800">{weatherData.current.clouds}</h3>
                                <p class="text-gray-600 font-medium">{weatherData.current.clouds}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <button class="text-blue-500 font-medium flex items-center" id="schedule-toggle">
                                <span>Schedule</span>
                                <i class="fas fa-chevron-down ml-1 transition-transform duration-300"></i>
                            </button>
                        </div>
                    </div>

                    {/* <!-- Weather details --> */}
                    <div class="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div class="weather-card__stat">
                            <p class="text-gray-500 text-sm">Humidity</p>
                            <p class="text-gray-800 font-bold text-lg">68%</p>
                        </div>
                        <div class="weather-card__stat">
                            <p class="text-gray-500 text-sm">Wind</p>
                            <p class="text-gray-800 font-bold text-lg">12 km/h</p>
                        </div>
                        <div class="weather-card__stat">
                            <p class="text-gray-500 text-sm">Feels like</p>
                            <p class="text-gray-800 font-bold text-lg">19°C</p>
                        </div>
                    </div>

                    {/* <!-- Schedule section (initially hidden) --> */}
                    <div class="weather-card__schedule mt-4 border-t border-gray-100 pt-4" id="schedule-container">
                        <div class="flex justify-between items-center mb-3">
                            <h4 class="font-medium text-gray-700">My Weekly Schedule</h4>
                            <button id="add-schedule-btn" class="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                                <i class="fas fa-plus mr-1"></i> Add
                            </button>
                        </div>

                        {/* <!-- Day tabs --> */}
                        <div class="flex overflow-x-auto space-x-2 pb-2 mb-3">
                            <button class="weather-card__day-tab weather-card__day-tab--active" data-day="monday">Monday</button>
                            <button class="weather-card__day-tab" data-day="tuesday">Tuesday</button>
                            <button class="weather-card__day-tab" data-day="wednesday">Wednesday</button>
                            <button class="weather-card__day-tab" data-day="thursday">Thursday</button>
                            <button class="weather-card__day-tab" data-day="friday">Friday</button>
                            <button class="weather-card__day-tab" data-day="saturday">Saturday</button>
                            <button class="weather-card__day-tab" data-day="sunday">Sunday</button>
                        </div>

                        {/* <!-- Schedule content --> */}
                        <div id="schedule-content" class="space-y-3 max-h-[300px] overflow-y-auto">
                            {/* <!-- Schedule items will be dynamically added here --> */}
                            <div class="text-gray-500 text-center py-4" id="empty-schedule">
                                No activities scheduled for this day.
                                <br />
                                <span class="text-sm">Click the + button to add one.</span>
                            </div>
                        </div>

                        {/* <!-- Add schedule form (initially hidden) --> */}
                        <div id="add-schedule-form" class="mt-4 p-4 bg-blue-50 rounded-lg hidden">
                            <h5 class="font-medium text-gray-700 mb-3">Add New Activity</h5>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-sm text-gray-600 mb-1">Day</label>
                                    <select id="schedule-day" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="monday">Monday</option>
                                        <option value="tuesday">Tuesday</option>
                                        <option value="wednesday">Wednesday</option>
                                        <option value="thursday">Thursday</option>
                                        <option value="friday">Friday</option>
                                        <option value="saturday">Saturday</option>
                                        <option value="sunday">Sunday</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm text-gray-600 mb-1">Time</label>
                                    <input type="time" id="schedule-time" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label class="block text-sm text-gray-600 mb-1">Activity</label>
                                    <input type="text" id="schedule-activity" placeholder="E.g., Morning run, Meeting, etc." class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div class="flex space-x-2">
                                    <button id="save-schedule-btn" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex-1">Save</button>
                                    <button id="cancel-schedule-btn" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Details section (initially hidden) --> */}
                    <div class="weather-card__details mt-4 border-t border-gray-100 pt-4" id="details-container">
                        <h4 class="font-medium text-gray-700 mb-3">Detailed Information</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Precipitation</span>
                                <span class="font-medium">65%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">UV Index</span>
                                <span class="font-medium">3 (Moderate)</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Pressure</span>
                                <span class="font-medium">1015 hPa</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Visibility</span>
                                <span class="font-medium">8 km</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Sunrise</span>
                                <span class="font-medium">6:24 AM</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Sunset</span>
                                <span class="font-medium">8:42 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default WeatherCard2;