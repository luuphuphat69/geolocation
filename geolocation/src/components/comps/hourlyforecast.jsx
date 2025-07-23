import '../../css/hourlyforecast.css'
import { useState, useEffect } from 'react';

const HourlyForecast = (hourlyForecastData) => {

    return (
        <div class="full-day-forecast">
            <h4 class="forecast-title">24-Hour Forecast</h4>
            <div class="forecast-scroll" id="forecast-scroll">

            </div>
        </div>
    );
}
export default HourlyForecast;