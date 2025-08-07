import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/search.css"
import "../css/validation.css"
import "../css/autocomplete-list.css"
import { getLocation } from "../ultilities/api/api"
import { getAllIndexDB, deleteSelectedIndex } from "../ultilities/browser/browser"
import WeatherCard2 from "./weathercard2"
import AllowNotify from "../components/comps/allownotify"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [validationMessage, setValidationMessage] = useState("")
  const [showValidation, setShowValidation] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleData, setScheduleData] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const navigate = useNavigate()

  const fetchSuggestions = async (query) => {
    try {
      const response = await getLocation(query)
      const data = await response.data
      setSuggestions(data)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    }
  }

  const validateInput = (input) => {
    if (!input || input.trim() === "") {
      return "Please enter a city name."
    }
    return ""
  }

  const handleOpenDialog = (city) => {
    setSelectedCity(city);
  };

  const handleCloseDialog = () => {
    setSelectedCity(null);

    // After close dialog, there's might be some changes, retrieve data again
    getAllIndexDB((dataFromDB) => {
      setScheduleData(dataFromDB);
    });

  };


  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchTerm(query)

    // Clear validation message when user starts typing
    if (showValidation) {
      setShowValidation(false)
      setValidationMessage("")
    }

    if (query) {
      fetchSuggestions(query)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (name) => {
    if (name && name.trim()) {
      setSearchTerm(name)
      setShowValidation(false)
      setValidationMessage("")
      navigate(`/result?city=${encodeURIComponent(name)}`)
    }
    setSuggestions([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  };

  const handleSearch = (e) => {
    const message = validateInput(searchTerm)

    if (message) {
      setValidationMessage(message)
      setShowValidation(true)
      return
    }

    if (searchTerm && searchTerm.trim()) {
      navigate(`/result?city=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleShowSchedule = () => {
    setShowSchedule(!showSchedule)
  }

  const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  useEffect(() => {
    getAllIndexDB((dataFromDB) => {
      setScheduleData(dataFromDB);
    });
  }, [showSchedule === true]);

  const handleDeleteSelectedSchedule = (city) => {
    const confirmed = window.confirm(`Are you sure you want to delete the schedule for ${city}?`);
    if (!confirmed) return;

    deleteSelectedIndex(city);
    getAllIndexDB((dataFromDB) => {
      setScheduleData(dataFromDB);
    });
  };


  return (
    <div className="weather-app">
      <div className="hero-background">
        <div className="clouds-bg"></div>
        <div className="light-rays"></div>
        <div className="sun-effect"></div>
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-center" style={{ color: '#000000' }}>Geolocation 🌍</h1>
          <p className="text-xl text-blue-100 mb-8 text-center" style={{ color: "#000000ff" }}>Search for a city to check the weather</p>
          <div className="search-container">
            <div className="flex flex-col md:flex-row gap-4">
              <input onKeyDown={handleKeyDown} onChange={handleSearchChange} type="text" id="citySearch" placeholder="Enter city name..." className="flex-grow px-5 py-3 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none text-lg" />
              <button onClick={handleSearch} id="searchBtn" className="btn btn-blue">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="autocomplete-list">
                {suggestions.map((suggestion) => (
                  <li key={suggestion._id} onClick={() => handleSuggestionClick(suggestion.name)}>
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            )}
            {/* Validation Message */}
            {showValidation && validationMessage && (
              <div className="validation-message">
                <span>{validationMessage}</span>
              </div>
            )}

          </div>
          {/* Notify switch */}
          <AllowNotify/>
          <button onClick={handleShowSchedule} id="showScheduleBtn" className="btn btn-indigo mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Show My Schedules
          </button>
          <div id="scheduleContainer" className={
            showSchedule === true && scheduleData?.length > 0
              ? " container-white"
              : "hidden"
          }
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">My Weather Schedules</h2>
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">Scroll for more</span>
            </div>

            <div className="schedules-scroll-container">
              {scheduleData?.map((city) => (
                <div key={city.id} className="space-y-6 mt-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <h3 className="text-xl font-bold text-blue-800 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {city.id}
                      </h3>
                      <button onClick={() => handleDeleteSelectedSchedule(city.id)} className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mt-1 mr-1">Delete</button>
                    </div>

                    <div className="weekly-schedule" onClick={() => handleOpenDialog(city)}>
                      {WEEKDAYS.map((day) => {
                        const activities = city.scheduleData[day] || [];
                        return (
                          <div key={day} className="day-column">
                            <div className="day-header text-blue-800">{capitalize(day)}</div>
                            {activities.length > 0 ? (
                              activities.map((item) => (
                                <div
                                  key={item.id}
                                  className={
                                    item.status === 'completed'
                                      ? "activity-chip text-blue-800 item-completed"
                                      : item.status === 'pending'
                                        ? "activity-chip text-blue-800 item-pending"
                                        : item.status === 'cancelled'
                                          ? "activity-chip text-blue-800 item-cancelled"
                                          : "activity-chip bg-blue-100 text-blue-800"
                                  }
                                >
                                  <div className="p-1 truncate max-w-[150px]" title={item.activity}>
                                    {item.activity}
                                  </div>
                                  <div className="activity-time">{item.time}</div>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-400 italic" style={{ textAlign: "center", padding: 20 }}>Empty</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={!!selectedCity} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Weather for {selectedCity?.id}</DialogTitle>
          </DialogHeader>
          {selectedCity && (
            <WeatherCard2
              city={selectedCity.id}
              lat={selectedCity.lat}
              long={selectedCity.long}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default Search