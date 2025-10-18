import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/search.css";
import { getLocation } from "../../../utilities/api/api";
import { LocalWeather } from "../components/localweather";
import SettingsComp from "../../settings/settings";
const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [validation, setValidation] = useState({
    format: true,
    length: false,
    available: false,
    isValid: false,
  });
  const [validationMessage, setValidationMessage] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const requirementsRef = useRef(null);

  // Fetch city suggestions
  const fetchSuggestions = async (query) => {
    try {
      const response = await getLocation(query);
      const data = await response.data;
      setSuggestions(data);
      return data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  // Validation logic
  const validateInput = (value, citySuggestions = []) => {
    const validation = {
      length: value.length >= 2,
      format: /^[a-zA-Z\s]+$/.test(value) || value === "",
      available: false,
      isValid: false,
    };

    if (value.length >= 2 && validation.format) {
      const normalizedValue = value.toLowerCase().trim();
      validation.available = citySuggestions.some(
        (city) =>
          city.name?.toLowerCase().includes(normalizedValue) ||
          city.country?.toLowerCase().includes(normalizedValue)
      );
    }

    validation.isValid = validation.length && validation.format && validation.available;
    return validation;
  };

  // Live validation on typing
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    // Fetch suggestions first
    const fetchedSuggestions = query.length >= 2 ? await fetchSuggestions(query) : [];

    // Validate input
    const validated = validateInput(query, fetchedSuggestions);
    setValidation(validated);

    // Determine validation message
    let message = "";
    if (!validated.format) {
      message = "No special characters allowed.";
    } else if (!validated.length && query.length > 0) {
      message = "Enter at least 2 characters.";
    } else if (validated.length && validated.format && !validated.available) {
      message = "City not found in database.";
    }

    setValidationMessage(message);

    // Hide suggestions if any validation fails
    if (message) {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setValidationMessage("");
    setShowRequirements(false);
    navigate(`/result?city=${encodeURIComponent(name)}`);
    setSuggestions([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (validation.isValid) {
      navigate(`/result?city=${encodeURIComponent(searchTerm)}`);
    } else {
      setShowRequirements(true);
    }
  };

  // Hide requirements when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        requirementsRef.current &&
        !requirementsRef.current.contains(event.target)
      ) {
        setShowRequirements(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => { },
      (err) => {
        console.error("Failed to get location:", err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <div className="search-page-container">
      <SettingsComp/>
      <div className="floating-shapes">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
        <div className="floating-shape shape-6"></div>
        <div className="floating-shape shape-7"></div>
        <div className="floating-shape shape-8"></div>
      </div>
      <header className="search-page-mb-3">
        <h1 className="search-page-main-title">Geolocation.space</h1>
        <p className="search-page-subtitle">Check weather data and forecasts</p>
      </header>

      <section className="search-page-input-container">
        <input
          ref={inputRef}
          type="text"
          className={`search-page-input-field ${validation.isValid ? "valid" : validationMessage ? "invalid" : ""}`}
          placeholder="Enter city name..."
          id="cityInput"
          aria-label="City name"
          autoComplete="off"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowRequirements(true)}
        />

        {/* Suggestions */}
        <div
          id="suggestionsDropdown"
          className={`search-page-suggestions-dropdown ${suggestions.length > 0 && !validationMessage ? "show" : ""
            }`}
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion._id}
              className="search-page-suggestion-item"
              onClick={() => handleSuggestionClick(suggestion.name)}
            >
              <div className="search-page-suggestion-text">{suggestion.name}</div>
            </div>
          ))}
        </div>

        {/* Validation Requirements */}
        {showRequirements && (
          <div
            ref={requirementsRef}
            className="search-page-input-requirements show"
            id="inputRequirements"
          >
            <div className="search-page-requirement-item">
              <div className={`search-page-requirement-icon ${validation.format ? "valid" : "invalid"}`}>
                {validation.format ? "✓" : "✗"}
              </div>
              <span>No special characters</span>
            </div>

            <div className="search-page-requirement-item">
              <div className={`search-page-requirement-icon ${validation.length ? "valid" : "invalid"}`}>
                {validation.length ? "✓" : "✗"}
              </div>
              <span>At least 2 characters</span>
            </div>

            <div className="search-page-requirement-item">
              <div className={`search-page-requirement-icon ${validation.available ? "valid" : "invalid"}`}>
                {validation.available ? "✓" : "✗"}
              </div>
              <span>City available in database</span>
            </div>
          </div>
        )}

        {/* Search button */}
        <button
          className="search-page-primary-btn"
          id="searchBtn"
          disabled={!validation.isValid}
          style={{
            opacity: validation.isValid ? "1" : "0.6",
            cursor: validation.isValid ? "pointer" : "not-allowed",
          }}
          onClick={handleSearch}
        >
          Search Weather
        </button>
      </section>
      <LocalWeather />
    </div>
  );
};

export default Search;