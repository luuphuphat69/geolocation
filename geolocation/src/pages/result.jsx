import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Eye, Thermometer, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

const columns = [
  { id: "name", label: "City" },
  { id: "state_name", label: "State / Province" },
  { id: "country_name", label: "Country" },
  { id: "latitude", label: "Latitude" },
  { id: "longitude", label: "Longitude" },
]

export default function Result() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("city");

  const rowsPerPage = 10
  const totalPages = Math.ceil(data.length / rowsPerPage)

  useEffect(() => {
    if (query) {
      setSearchTerm(query)
      getData(query)
    }
  }, [query])

  const getData = async (term) => {
    if (!term) {
      console.error("Query is empty or undefined")
      return
    }
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:3000/v1/location?queries=${term}`)
      setData(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handleRowClick = (row) => {
    setSelectedRow(row)
  }

  const handleCloseDialog = () => {
    setSelectedRow(null)
  }

  const handleSearch = () => {
    getData(searchTerm)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Search Results for &quot;{searchTerm}&quot;</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Search locations..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(e.target.value);
                  handleSearch();
                }
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.id}>{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((row) => (
                        <TableRow
                          key={row.id}
                          onClick={() => handleRowClick(row)}
                          className="cursor-pointer hover:bg-muted"
                        >
                          {columns.map((column) => (
                            <TableCell key={column.id}>{row[column.id]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={page === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={!!selectedRow} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weather for {selectedRow?.name}</DialogTitle>
          </DialogHeader>
          {selectedRow && <WeatherCard city={selectedRow?.name} lat={selectedRow?.latitude} long={selectedRow?.longitude} />}
        </DialogContent>
      </Dialog>
      <Toaster/>
    </div>
  )
}

// Placeholder for WeatherCard component
function WeatherCard({ city, lat, long }) {

  const [weatherData, setWeatherData] = useState(null)
  const [notifyEmail, setNotifyEmail] = useState(false)
  const [seeDetails, setSeeDatails] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const navigate = useNavigate()
  const handleNavigate = (city, lat, long) => {
    navigate(`/details?city=${city}&lat=${lat}&long=${long}`) // Navigate programmatically
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
    
    await axios.post(`http://localhost:3000/v1/lambda?mail=${email}`);
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
                    We will send you daily weather notifications for {city} at 7:00 AM - 4:00 PM - 9:00 PM.
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