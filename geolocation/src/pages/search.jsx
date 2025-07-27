import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/search.css"
import "../css/button.css"
import "../css/validation.css"
import "../css/autocomplete-list.css"
import { getLocation } from "../ultilities/api/api"

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [validationMessage, setValidationMessage] = useState("")
  const [showValidation, setShowValidation] = useState(false)
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
    }
    setSuggestions([])
  }

  const handleSearch = (e) => {
    e.preventDefault()
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

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* <SiteHeader /> */}
      <div className="s013 flex-1">
        <form id="form" onSubmit={handleSearch}>
          <fieldset>
            <legend>QUICK FIND YOUR CITY</legend>
          </fieldset>
          <div className="inner-form">
            <div className="left">
              <div className="input-wrap first">
                <div className="input-field first">
                  <label>
                    WHAT CITY ?
                    <input
                      id="input"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className={showValidation && validationMessage ? "error" : ""}
                    />
                  </label>

                  {/* Validation Message */}
                  {showValidation && validationMessage && (
                    <div className="validation-message">
                      <span>{validationMessage}</span>
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <ul className="autocomplete-list">
                      {suggestions.map((suggestion) => (
                        <li key={suggestion._id} onClick={() => handleSuggestionClick(suggestion.name)}>
                          {suggestion.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <button id="button" style={{ marginLeft: "10px" }}>
              Find now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Search
