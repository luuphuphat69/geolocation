import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { Eye, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import '../../css/weathercard.css'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToastAction } from "@/components/ui/toast"

const WeatherCard2 = ({ city, lat, long }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [currentUnit, setCurrentUnit] = useState('C');
    const [notifyEmail, setNotifyEmail] = useState(false)
    const [seeDetails, setSeeDatails] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [id, setId] = useState("");
    const { toast } = useToast()

    const navigate = useNavigate()
    const handleNavigate = (city, lat, long) => {
        navigate(`/details?city=${city}&lat=${lat}&long=${long}`)
    }

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const temper = await axios.get(`http://localhost:3000/v1/weather/current?lat=${lat}&long=${long}`)
                setWeatherData(temper.data);

                console.log(temper.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchWeatherData();
    }, [lat, long]);

    if (!weatherData) {
        return <p>Loading weather data...</p>
    }

    const iconCode = weatherData.current.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const kelvinToCelsius = (k) => Math.round(k - 273.15);
    const kelvinToFahrenheit = (k) => Math.round((k * 9) / 5 - 459.67);
    const handleUnitClick = (unit) => {
        if (unit === currentUnit) return;

        setCurrentUnit(unit);
    };

    const handleUnsubcribe = async (emai, id) => {
        await axios.get(`http://localhost:3000/v1/lambda/unsub?mail=${email}&id=${id}`);
        toast({
            title: "Geolocation Notification",
            description: "We sent you an email. Please check your mail box and confirm to unsubcribe our notificaion"
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotifyEmail(true);
        setIsDialogOpen(false);

        try {
            const response = await axios.post(`http://localhost:3000/v1/lambda/sub?mail=${email}&city=${city}&lat=${lat}&long=${long}`);
            const description = response.status === 281
                ? 'This mail is USED. Use another email or unsubscribe now'
                : `You will receive daily weather updates for ${city} at 7:00 AM to ${email}`;

            const variant = response.status === 281 ? 'destructive' : '';
            const id = response.status === 281 ? response.data.ID : null
            if (id) {
                setId(id);
            }

            toast({
                title: "Geolocation Notification",
                description: description,
                action: <ToastAction onClick={() => handleUnsubcribe(email, id)} altText="Unsubscribe">Unsubscribe</ToastAction>,
                variant: variant,
            });

        } catch (error) {
            console.error("Error subscribing:", error);
            toast({
                title: "Error",
                description: "There was an error setting up notifications. Please try again.",
                variant: "destructive",
            });
        }

        setEmail("");
    }

    return (
        <div class="weather-app">
            <div class="weather-card">
                {/* <!-- Header with city name and local time --> */}
                <div class="weather-card__header">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-3xl font-bold">{city}</h2>
                            {/* <p class="text-blue-100" id="local-time">{weatherData.timezone}</p> */}
                        </div>
                        <div class="flex space-x-3">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant={notifyEmail ? "secondary" : "outline"}
                                        size="icon"
                                        aria-label={notifyEmail ? "Unfollow location" : "Follow location"}
                                        className={notifyEmail ? "bg-yellow-400 text-blue-800" : "text-yellow-400"}
                                    >
                                        <Bell className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Subscribe to Weather Updates. One mail per location</DialogTitle>
                                        <DialogDescription>
                                            We will send you daily weather notifications for {city} at 7:00 AM.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="email" className="text-right">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="col-span-3"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button type="submit">Subscribe</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Button
                                onClick={() => handleNavigate(city, lat, long)}
                                variant={seeDetails ? "secondary" : "outline"}
                                size="icon"
                                aria-label="See more details"
                                className={seeDetails ? "bg-yellow-400 text-blue-800" : "text-yellow-400"}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* <!-- Main weather info --> */}
                <div class="weather-card__content">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="weather-card__icon text-6xl text-blue-500 mr-4">
                                <img src={iconUrl} alt={weatherData.current.weather[0].description} className="w-16 h-16" />
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h3 className="text-4xl font-bold text-gray-800">
                                        {currentUnit === 'C'
                                            ? `${kelvinToCelsius(weatherData.current.temp)}°C`
                                            : `${kelvinToFahrenheit(weatherData.current.temp)}°F`}
                                    </h3>
                                    <div className="weather-card__unit-toggle ml-2">
                                        <span
                                            className={`weather-card__unit-option ${currentUnit === 'C' ? 'weather-card__unit-option--active' : ''
                                                }`}
                                            onClick={() => handleUnitClick('C')}
                                        >
                                            °C
                                        </span>
                                        <span
                                            className={`weather-card__unit-option ${currentUnit === 'F' ? 'weather-card__unit-option--active' : ''
                                                }`}
                                            onClick={() => handleUnitClick('F')}
                                        >
                                            °F
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 font-medium">
                                    {weatherData.current.weather[0].description}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <button className="text-blue-500 font-medium flex items-center" id="schedule-toggle">
                                <span>Schedule</span>
                                <i className="fas fa-chevron-down ml-1 transition-transform duration-300"></i>
                            </button>
                        </div>
                    </div>

                    {/* <!-- Weather details --> */}
                    <div class="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div class="weather-card__stat">
                            <p class="text-gray-500 text-sm">Humidity</p>
                            <p class="text-gray-800 font-bold text-lg">{weatherData.current.humidity}%</p>
                        </div>
                        <div class="weather-card__stat">
                            <p class="text-gray-500 text-sm">Wind</p>
                            <p class="text-gray-800 font-bold text-lg">{weatherData.current.wind_speed} km/h</p>
                        </div>
                        <div class="weather-card__stat">
                            <p class="text-gray-500 text-sm">Feels like</p>
                            <p class="text-gray-800 font-bold text-lg" id="feels-like">
                                {currentUnit === 'C'
                                    ? `${kelvinToCelsius(weatherData.current.feels_like)}°C`
                                    : `${kelvinToFahrenheit(weatherData.current.feels_like)}°F`}
                            </p>
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