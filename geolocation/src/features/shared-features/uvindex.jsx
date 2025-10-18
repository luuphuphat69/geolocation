import '../../css/uvindex.css';

const UVIndex = ({ cityData }) => {
    const getUVIndexAdvice = (uvIndex) => {
        if (uvIndex <= 2) return [
            "Low risk. Minimal protection needed.",
            "Wear sunglasses if outdoors.",
            "Enjoy outdoor activities safely."
        ];
        if (uvIndex <= 5) return [
            "Moderate risk. Protection advised.",
            "Wear SPF 30+ sunscreen.",
            "Wear a hat and sunglasses."
        ];
        if (uvIndex <= 7) return [
            "High risk. Protection essential.",
            "Apply broad-spectrum sunscreen.",
            "Seek shade during midday hours."
        ];
        if (uvIndex <= 10) return [
            "Very high risk. Limit sun exposure.",
            "Avoid outdoor activities from 10 AM–4 PM.",
            "Wear UV-protective clothing and accessories."
        ];
        return [
            "Extreme risk. Avoid sun if possible.",
            "Stay indoors or in complete shade.",
            "Use maximum SPF and protective gear."
        ];
    };
    const uvAdvices = getUVIndexAdvice(cityData.current.uvi);

    return (
        <div class="uv-index-card">
            <div class="card-header">
                <h2 class="text-xl font-semibold text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    UV Index
                </h2>
            </div>
            <div class="card-content">
                <div class="flex flex-col items-center mb-6">
                    <div class="uv-gauge mb-4">
                        <div class="uv-gauge-bg"></div>
                        <div className="uv-needle" style={{ "--uv-value": cityData.current.uvi }}></div>
                        <div class="uv-gauge-inner">
                            <div class="uv-level">{cityData.current.uvi}</div>
                            <div className={`uv-text ${cityData.current.uvi <= 2 ? "uv-low" :
                                cityData.current.uvi <= 5 ? "uv-moderate" :
                                    cityData.current.uvi <= 7 ? "uv-high" : "uv-very-high"}`}>
                                {cityData.current.uvi <= 2 ? "Low" :
                                    cityData.current.uvi <= 5 ? "Moderate" :
                                        cityData.current.uvi <= 7 ? "High" : "Very High"}
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm text-gray-600">Current UV Index: {cityData.current.uvi}</div>
                        <div class="text-lg font-medium text-yellow-600">Protection recommended</div>
                    </div>
                </div>


                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                    <h3 className="font-medium text-yellow-800 mb-2">Protection Recommended</h3>
                    <ul className="uv-advice-list">
                        {uvAdvices.map((advice, index) => (
                            <li key={index} className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-gray-700">{advice}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 class="font-medium text-blue-800 mb-2">UV Index Scale</h3>
                    <div className="grid grid-cols-5 gap-1 mb-1">
                        <div className="h-6 uv-bg-low rounded-l-md flex items-center justify-center text-xs text-white font-medium">Low</div>
                        <div className="h-6 uv-bg-moderate flex items-center justify-center text-xs text-white font-medium">Moderate</div>
                        <div className="h-6 uv-bg-high flex items-center justify-center text-xs text-white font-medium">High</div>
                        <div className="h-6 uv-bg-very-high flex items-center justify-center text-xs text-white font-medium">Very High</div>
                        <div className="h-6 uv-bg-extreme rounded-r-md flex items-center justify-center text-xs text-white font-medium">Extreme</div>
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-xs text-gray-500 text-center">
                        <span>1–2</span>
                        <span>3–5</span>
                        <span>6–7</span>
                        <span>8–10</span>
                        <span>11+</span>
                    </div>
                </div>
            </div>
            <div class="fade-bottom"></div>
        </div>
    );
}
export default UVIndex;