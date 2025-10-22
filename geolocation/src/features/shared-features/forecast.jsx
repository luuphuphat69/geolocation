import '../../css/forecast.css';
import { celsiusToFahrenheit, formatDate } from '../../utilities/common';
import { useAppOptions } from '../../AppOptionsContext';

const Forecast = ({ forecast }) => {
  const { isCelciusUnit, setIsCelciusUnit } = useAppOptions();

  const handleUnitClick = (unit) => {
    const toCelsius = unit === 'C';
    if (toCelsius !== isCelciusUnit) {
      setIsCelciusUnit(toCelsius);
    }
  };

  return (
    <div className="forecast-card md:col-span-3">
      <div className="card-header flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 
              00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          5 Day Forecast
        </h2>
        <div className="text-sm text-gray-500 unit-toggle ml-4" id="unit-toggle">
          <button
            id="celsius"
            className={isCelciusUnit ? 'active' : ''}
            onClick={() => handleUnitClick('C')}
          >
            °C
          </button>{' '}
          |{' '}
          <button
            id="fahrenheit"
            className={!isCelciusUnit ? 'active' : ''}
            onClick={() => handleUnitClick('F')}
          >
            °F
          </button>
        </div>
      </div>

      <div className="card-content">
        <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {forecast.map((day, index) => {
            const temp = isCelciusUnit
              ? `${day.main.temp}°C`
              : `${celsiusToFahrenheit(day.main.temp)}°F`;

            return (
              <div className="forecast-day p-4" key={index}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{formatDate(day.dt_txt)}</h3>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="forecast-icon text-yellow-500">
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt={day.weather[0].description}
                    />
                  </div>
                  <div className="ml-2 text-right">{temp}</div>
                </div>
                <div className="text-sm text-gray-600" style={{textAlign:'center'}}>
                  {day.weather[0].description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fade-bottom"></div>
    </div>
  );
};

export default Forecast;