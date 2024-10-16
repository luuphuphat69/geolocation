import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/search.css';
import '../css/button.css';
import '../css/autocomplete-list.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`http://localhost:3000/v1/location?queries=${query}`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (query) {
            fetchSuggestions(query);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (name) => {
        if (name && name.trim()) {
            setSearchTerm(name);
        }
        setSuggestions([]);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm && searchTerm.trim()) {
            navigate("/result", { state: { query: searchTerm } });
        } else {
            alert('Please enter a valid search term.');
        }
    };

    return (
        <div className="s013">
            <form id="form" onSubmit={handleSearch}>
                <fieldset>
                    <legend>QUICK FIND YOUR CITY</legend>
                </fieldset>
                <div className="inner-form">
                    <div className="left">
                        <div className="input-wrap first">
                            <div className="input-field first">
                                <label>WHAT CITY ?
                                    <input
                                        id="input"
                                        type="text"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </label>
                                {suggestions.length > 0 && (
                                    <ul className="autocomplete-list">
                                        {suggestions.map((suggestion) => (
                                            <li
                                                key={suggestion._id}
                                                onClick={() => handleSuggestionClick(suggestion.name)}
                                            >
                                                {suggestion.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    <button id='button' style={{ marginLeft: '10px' }}>Find now</button>
                </div>
            </form>
        </div>
    );
};

export default Search;