import '../../css/airpollution.css';

const AirPollution = ({ airPollution }) => {

    const getAQIDescription = (aqi) => {
        const descriptions = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
        return descriptions[aqi - 1] || 'Unknown'
    }

    const getAQIColor = (aqi) => {
        const colors = ["air-quality-good", "air-quality-moderate", "air-quality-unhealthy", "air-quality-danger", "air-quality-hazardous"]
        return colors[aqi - 1] || colors[0]
    }

    const getAQIRecommendation = (aqi) => {
        switch (aqi) {
            case 1:
                return "Air quality is excellent. Enjoy outdoor activities!"
            case 2:
                return "Air quality is acceptable. Sensitive individuals should consider reducing prolonged outdoor exertion."
            case 3:
                return "Members of sensitive groups may experience health effects. The general public is less likely to be affected."
            case 4:
                return "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects."
            case 5:
                return "Health alert: The risk of health effects is increased for everyone. Avoid outdoor activities."
            default:
                return "No recommendation available."
        }
    }

    return (
        <div className="air-pollution-card p-6">
            <h2 class="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Air Quality
                <div class="tooltip ml-2">
                    <button class="text-blue-500 hover:text-blue-700 focus:outline-none" id="info-button" aria-label="Air Quality Information">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div class="tooltip-content" id="tooltip-content">
                        <h3 class="font-semibold text-sm mb-2">Air Quality Index Levels</h3>
                        <div class="overflow-x-auto">
                            <table class="tooltip-table">
                                <thead>
                                    <tr>
                                        <th>Quality</th>
                                        <th>Index</th>
                                        <th>SO₂</th>
                                        <th>NO₂</th>
                                        <th>PM10</th>
                                        <th>PM2.5</th>
                                        <th>O₃</th>
                                        <th>CO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="quality-name">Good</td>
                                        <td>1</td>
                                        <td>0-20</td>
                                        <td>0-40</td>
                                        <td>0-20</td>
                                        <td>0-10</td>
                                        <td>0-60</td>
                                        <td>0-4400</td>
                                    </tr>
                                    <tr>
                                        <td class="quality-name">Fair</td>
                                        <td>2</td>
                                        <td>20-80</td>
                                        <td>40-70</td>
                                        <td>20-50</td>
                                        <td>10-25</td>
                                        <td>60-100</td>
                                        <td>4400-9400</td>
                                    </tr>
                                    <tr>
                                        <td class="quality-name">Moderate</td>
                                        <td>3</td>
                                        <td>80-250</td>
                                        <td>70-150</td>
                                        <td>50-100</td>
                                        <td>25-50</td>
                                        <td>100-140</td>
                                        <td>9400-12400</td>
                                    </tr>
                                    <tr>
                                        <td class="quality-name">Poor</td>
                                        <td>4</td>
                                        <td>250-350</td>
                                        <td>150-200</td>
                                        <td>100-200</td>
                                        <td>50-75</td>
                                        <td>140-180</td>
                                        <td>12400-15400</td>
                                    </tr>
                                    <tr>
                                        <td class="quality-name">Very Poor</td>
                                        <td>5</td>
                                        <td>≥350</td>
                                        <td>≥200</td>
                                        <td>≥200</td>
                                        <td>≥75</td>
                                        <td>≥180</td>
                                        <td>≥15400</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="text-xs text-gray-500">All values in μg/m³ except CO (in μg/m³)</div>
                    </div>
                </div>
            </h2>
            <div class="card-content">
                <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 rounded-full text-white flex items-center justify-center mr-4 ${getAQIColor(airPollution.main.aqi)}`}>
                        <span className="text-2xl font-bold">{airPollution.main.aqi}</span>
                    </div>
                    <div>
                        <div className="text-xl font-semibold">
                            {getAQIDescription(airPollution.main.aqi)}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 h-2 rounded-full mb-4">
                    <div
                        className={`h-2 rounded-full ${getAQIColor(airPollution.main.aqi)}`}
                        style={{ width: `${(airPollution.main.aqi / 5) * 100}%` }}
                    ></div>
                </div>


                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">PM2.5</div>
                        <div class="text-xl font-semibold">{airPollution.components.pm2_5.toFixed(2)} µg/m³</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">PM10</div>
                        <div class="text-xl font-semibold">{airPollution.components.pm10.toFixed(2)} µg/m³</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">NO₂</div>
                        <div class="text-xl font-semibold">{airPollution.components.no2.toFixed(2)} ppb</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">O₃</div>
                        <div class="text-xl font-semibold">{airPollution.components.o3.toFixed(2)} ppb</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">CO</div>
                        <div class="text-xl font-semibold">{airPollution.components.co.toFixed(2)} ppb</div>
                    </div>
                    <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm text-gray-500">SO2</div>
                        <div class="text-xl font-semibold">{airPollution.components.so2.toFixed(2)} ppb</div>
                    </div>
                </div>

                <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 class="font-medium text-yellow-800 mb-2">Air Quality Recommendation</h3>
                    <div className="flex flex-row items-start" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-gray-700">{getAQIRecommendation(airPollution.main.aqi)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AirPollution;