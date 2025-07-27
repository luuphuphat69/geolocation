import '../../css/forecast.css';
import { useState } from 'react';
const Forecast = ({ forecast }) => {
    const [currentUnit, setCurrentUnit] = useState('C');

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
    const celsiusToFahrenheit = (c) => Math.round((c * 9/5 + 32) * 10) / 10;
    
    const handleUnitClick = (unit) => {
        if (unit === currentUnit) return;
        setCurrentUnit(unit);
    };

    return (
        <div className="forecast-weather-card md:col-span-3">
            <div className="card-header flex justify-between items-center">
                <h2 class="text-xl font-semibold text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    5 Day Forecast
                </h2>
                <div class="text-sm text-gray-500 unit-toggle" id="unit-toggle">
                    <button id="celsius" class="active" onClick={() => handleUnitClick('C')}>°C</button> | <button id="fahrenheit" class="inactive" onClick={() => handleUnitClick('F')}>°F</button>
                </div>
            </div>

            <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {/* Day Blocks */}
                    {forecast.map((day, index) => (
                        <div className="forecast-day p-4" key={index}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">{formatDate(day.dt_txt)}</h3>
                                <span className="text-sm text-gray-500">{formatDate(day.dt_txt)}</span>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <div className='forecast-icon text-yellow-500'>
                                    <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="Weather icon" />
                                </div>
                                <div className="text-right">
                                    {currentUnit === 'C' ? Math.round(day.main.temp * 10)/10 + "°C" : 
                                    celsiusToFahrenheit(day.main.temp) + "°F"}
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">{day.weather[0].description}</div>
                        </div>
                    ))}
                </div>

                {/* <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Weekly Weather Summary</h3>
                    <p className="text-gray-700">
                        Temperatures will gradually decrease throughout the week with rain expected on Wednesday and Thursday. Friday will be cooler with overcast skies.
                    </p>
                </div> */}
            </div>

            <div className="fade-bottom"></div>
        </div>
    );
};

export default Forecast;