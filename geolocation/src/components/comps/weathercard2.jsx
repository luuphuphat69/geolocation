import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { Eye, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import '../../css/weathercard.css'
import Schedule from './schedule';
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
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
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

    const kelvinToCelsius = (k) => Math.round((k - 273.15) * 10) / 10;
    const kelvinToFahrenheit = (k) => Math.round(((k * 9) / 5 - 459.67) * 10) / 10;

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

    const handleAddSchedule = () => {
        if (!formTime || !formActivity.trim()) return alert('Fill in all fields.');

        const newData = { ...scheduleData };
        newData[formDay].push({ time: formTime, activity: formActivity.trim(), status: 'pending' });
        setScheduleData(newData);
        setShowForm(false);
        setCurrentDay(formDay);
    };

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

                {/* <!-- Scrollable content wrapper --> */}
                <div class="weather-card__content-wrapper">
                    {/* <!-- Tabs for main sections --> */}
                    <div class="weather-card__tabs" id="main-tabs">
                        <div class="weather-card__tab weather-card__tab--active" data-tab="weather">Weather</div>
                        <div class="weather-card__tab" data-tab="schedule">Schedule</div>
                    </div>

                    {/* <!-- Main weather info section --> */}
                    <div class="weather-card__section weather-card__section--active" data-section="weather">
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

                            {/* <!-- Forecast preview --> */}
                            <div class="mt-6">
                                <h4 class="font-medium text-gray-700 mb-3">5-Day Forecast</h4>
                                <div class="flex space-x-3 overflow-x-auto pb-2">
                                    <div class="flex-shrink-0 text-center p-3 bg-blue-50 rounded-lg w-20">
                                        <p class="text-gray-500 text-sm">Tue</p>
                                        <div class="text-blue-500 my-1"><i class="fas fa-cloud-sun"></i></div>
                                        <p class="text-gray-800 font-medium">23°</p>
                                    </div>
                                    <div class="flex-shrink-0 text-center p-3 bg-blue-50 rounded-lg w-20">
                                        <p class="text-gray-500 text-sm">Wed</p>
                                        <div class="text-blue-500 my-1"><i class="fas fa-sun"></i></div>
                                        <p class="text-gray-800 font-medium">25°</p>
                                    </div>
                                    <div class="flex-shrink-0 text-center p-3 bg-blue-50 rounded-lg w-20">
                                        <p class="text-gray-500 text-sm">Thu</p>
                                        <div class="text-blue-500 my-1"><i class="fas fa-cloud"></i></div>
                                        <p class="text-gray-800 font-medium">22°</p>
                                    </div>
                                    <div class="flex-shrink-0 text-center p-3 bg-blue-50 rounded-lg w-20">
                                        <p class="text-gray-500 text-sm">Fri</p>
                                        <div class="text-blue-500 my-1"><i class="fas fa-cloud-rain"></i></div>
                                        <p class="text-gray-800 font-medium">20°</p>
                                    </div>
                                    <div class="flex-shrink-0 text-center p-3 bg-blue-50 rounded-lg w-20">
                                        <p class="text-gray-500 text-sm">Sat</p>
                                        <div class="text-blue-500 my-1"><i class="fas fa-cloud-sun"></i></div>
                                        <p class="text-gray-800 font-medium">24°</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default WeatherCard2;