import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, Thermometer, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function WeatherCard({ city, lat, long }) {

    const [weatherData, setWeatherData] = useState(null)
    const [notifyEmail, setNotifyEmail] = useState(false)
    const [seeDetails, setSeeDatails] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [email, setEmail] = useState("")
    const { toast } = useToast()
    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    const navigate = useNavigate()
    const handleNavigate = (city, lat, long) => {
        navigate(`/details?city=${city}&lat=${lat}&long=${long}`)
    }

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const temper = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=${API_KEY}`)
                setWeatherData(temper.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchWeatherData();
    }, [lat, long]);

    if (!weatherData) {
        return <p>Loading weather data...</p>
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setNotifyEmail(true)
        setIsDialogOpen(false)

        await axios.post(`http://localhost:3000/v1/lambda?mail=${email}&city=${city}&lat=${lat}&long=${long}`);
        toast({
            title: "Notification Set",
            description: `You will receive daily weather updates for ${city} at 7:00 AM to ${email}`,
        })
        setEmail("")
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Current Weather</span>
                    <div className="flex space-x-2">
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
                                    <DialogTitle>Subscribe to Weather Updates</DialogTitle>
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
                </CardTitle>
                <CardDescription>{weatherData.current.weather[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Thermometer className="h-8 w-8 text-red-500" />
                        <div>
                            <p className="text-2xl font-bold">
                                {Math.round(weatherData.current.temp - 273.15)}°C /
                                {Math.round((weatherData.current.temp * 9) / 5 - 459.67)}°F
                            </p>
                            <p className="text-muted-foreground">Temperature</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-right">Humidity: {weatherData.current?.humidity}%</p>
                        <p className="text-right">Wind: {weatherData.current?.wind_speed} mph</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}