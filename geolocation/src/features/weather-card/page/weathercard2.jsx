import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { Eye, Bell } from "lucide-react"
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import '../../../css/weathercard.css'
import { getCurrentWeather, getHourlyForecast, SendActivasion, unsubcribeNotify } from '../../../utilities/api/api';
import WeatherCard_Comp from '../components/weather-tab';
import Schedule from '../components/schedule'
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

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const WeatherCard2 = ({ city, lat, long }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [notifyEmail, setNotifyEmail] = useState(false)
    const [seeDetails, setSeeDatails] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [activeTab, setActiveTab] = useState("weather");
    const [hourlyForecastData, setHourlyForecastData] = useState(null);
    const { toast } = useToast()

    const navigate = useNavigate()
    const handleNavigate = (city, lat, long) => {
        navigate(`/details?city=${city}&lat=${lat}&long=${long}`)
    }

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const temper = await getCurrentWeather(lat, long);
                setWeatherData(temper.data);
            
                const hourlyForecast = await getHourlyForecast(lat, long);
                setHourlyForecastData(hourlyForecast.data);

            } catch (err) {
                console.log(err);
            }
        }
        fetchWeatherData();
    }, [lat, long]);

    if (!weatherData) {
        return <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }

    const iconCode = weatherData.current.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const handleUnsubcribe = async (id, mail) => {
        await unsubcribeNotify(id, mail)
        toast({
            title: "Geolocation Notification",
            description: "We sent you an email. Please check your mail box and confirm to unsubcribe our notificaion"
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotifyEmail(true);
        setIsDialogOpen(false);

        const isEmail = isValidEmail(email);
        if (isEmail === false) {
            toast({
                title: "Geolocation Notification",
                description: "Invalid email, please input another valid email",
                variant: "destructive",
            });
        }


        try {
            const response = await SendActivasion(email, city, lat, long);
            const description = response.status === 409
                ? 'This mail is USED. Use another email or unsubscribe now'
                : `You will receive daily weather updates for ${city} at 7:00 AM to ${email}`;

            const variant = response.status === 409 ? 'destructive' : '';
            const id = response.status === 409 ? response.data.ID : null

            toast({
                title: "Geolocation Notification",
                description: description,
                action: <ToastAction onClick={() => handleUnsubcribe(id, email)} altText="Unsubscribe">Unsubscribe</ToastAction>,
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

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="weather-app">
            <div className="weather-card">
                {/* <!-- Header with city name and local time --> */}
                <div className="weather-card__header">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold">{city}</h2>
                            {hourlyForecastData ? <p className="text-blue-100" id="local-time">{hourlyForecastData.location.localtime}</p> :
                                <Loader2 className="h-8 w-8 animate-spin" />
                            }
                        </div>
                        <div className="flex space-x-3">
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
                <div className="weather-card__content-wrapper">
                    {/* <!-- Tabs for main sections --> */}
                    <div className="weather-card__tabs" id="main-tabs">
                        <div
                            className={`weather-card__tab ${activeTab === "weather" ? "weather-card__tab--active" : ""}`}
                            data-tab="weather"
                            onClick={() => handleTabClick("weather")}
                        >
                            Weather
                        </div>
                        <div
                            className={`weather-card__tab ${activeTab === "schedule" ? "weather-card__tab--active" : ""}`}
                            data-tab="schedule"
                            onClick={() => handleTabClick("schedule")}
                        >
                            Schedule
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="weather-card__sections" >
                        <div
                            className={`weather-card__section ${activeTab === "weather" ? "weather-card__section--active" : ""}`}
                            data-section="weather"
                            style={{ display: activeTab.includes("weather") ? "block" : "none" }}
                        >
                            {/* Weather content goes here */}
                            <WeatherCard_Comp weatherData={weatherData} hourlyForecastData={hourlyForecastData} iconUrl={iconUrl} />
                        </div>
                        <div
                            className={`weather-card__section ${activeTab === "schedule" ? "weather-card__section--active" : ""}`}
                            data-section="schedule"
                            style={{ display: activeTab.includes("schedule") ? "block" : "none" }}
                        >
                            {/* Schedule content goes here */}
                            <Schedule cityName={city} lat={lat} long={long}></Schedule>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default WeatherCard2;