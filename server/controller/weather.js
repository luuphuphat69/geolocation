const axios = require('axios');

const weather = {
    GetCurrentWeatherData: async (req, res) => {
        try {
            const lat = req.query.lat;
            const long = req.query.long;

            if (!lat || !long) {
                return res.status(400).json({ error: 'Latitude and longitude are required' });
            }

            const response = await axios.get(
                `https://api.openweathermap.org/data/3.0/onecall`,
                {
                    params: {
                        lat,
                        lon: long,
                        exclude: 'hourly,daily',
                        appid: process.env.OPENWEATHER_API_KEY,
                    },
                }
            );

            res.status(200).json(response.data);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    },

    GetWeatherForecastData: async (req, res) => {
        try {
            const lat = req.query.lat;
            const long = req.query.long;

            if (!lat || !long) {
                return res.status(400).json({ error: 'Latitude and longitude are required' });
            }

            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast`,
                {
                    params: {
                        lat,
                        lon: long,
                        appid: process.env.OPENWEATHER_API_KEY,
                        units: 'metric'
                    },
                }
            );

            res.status(200).json(response.data);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    },
    
    GetHoursForecastData: async (req, res) => {
        try {
            const lat = req.query.lat;
            const long = req.query.long;

            if (!lat || !long) {
                return res.status(400).json({ error: 'Latitude and longitude are required' });
            }

            const forecast = await axios.get(`http://api.weatherapi.com/v1/forecast.json`, {
                params: {
                    key: process.env.WEATHER_API_KEY,
                    q: `${lat},${long}`
                }
            });

            res.status(200).json(forecast.data);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    },

    GetAirPollutionData: async (req, res) => {
        try {
            const lat = req.query.lat;
            const long = req.query.long;

            if (!lat || !long) {
                return res.status(400).json({ error: 'Latitude and longitude are required' });
            }

            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/air_pollution`,
                {
                    params: {
                        lat,
                        lon: long,
                        appid: process.env.OPENWEATHER_API_KEY,
                    },
                }
            );

            res.status(200).json(response.data);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    }
};

module.exports = weather;