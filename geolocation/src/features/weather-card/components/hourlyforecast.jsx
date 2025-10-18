import '../../../css/hourlyforecast.css'
import { Loader2 } from "lucide-react";
import { celsiusToFahrenheit, fahrenheitToCelsius } from '../../../utilities/common';
import { useAppOptions } from '../../../AppOptionsContext';
const HourlyForecast = ({ hourlyForecastData }) => {
    const { isCelciusUnit, setIsCelciusUnit } = useAppOptions();

    if (
        !hourlyForecastData ||
        !hourlyForecastData.forecast ||
        !hourlyForecastData.forecast.forecastday ||
        !hourlyForecastData.forecast.forecastday[0] ||
        !hourlyForecastData.forecast.forecastday[0].hour
    ) {
        return  <Loader2 className="h-8 w-8 animate-spin" />
    }

    return (
        <div className="full-day-forecast">
            <h4 className="forecast-title">24-Hour Forecast</h4>
            <div className="forecast-scroll" id="forecast-scroll">
                {hourlyForecastData.forecast.forecastday[0].hour.map((item, index) => (
                    <div key={index} className={`forecast-item ${item.isCurrent ? 'forecast-item--current' : ''}`}>
                        <p className="forecast-time">{item.time.split(' ')[1]}</p>
                        <div className="forecast-icon">
                            <img src={`https:${item.condition.icon}`} alt="weather icon" />
                        </div>
                        <p className="forecast-temp">{isCelciusUnit ? item.temp_c  + "°C" :
                         celsiusToFahrenheit(item.temp_c) + "°F"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourlyForecast;