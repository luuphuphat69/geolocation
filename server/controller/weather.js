const axios = require('axios');
const redisClient = require('../redisClient');
const weather = {
    GetCurrentWeatherData: async (req, res) => {
        try {
            const lat = req.query.lat;
            const long = req.query.long;

            if (!lat || !long) {
                return res.status(400).json({ error: 'Latitude and longitude are required' });
            }

            const cacheKey = `current_weather:${lat},${long}`;

            // Check the cache
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            // Fetch data from OpenWeather API
            const response = await axios.get(
                `https://api.openweathermap.org/data/3.0/onecall`,
                {
                    params: {
                        lat: lat,
                        lon: long,
                        exclude: 'hourly,daily',
                        appid: process.env.API_KEY,
                    },
                }
            );
            const weatherData = response.data;
            // Cache the response
            await redisClient.set(cacheKey, JSON.stringify(weatherData), {
                EX: 600, // Expire after 600 seconds
            });

            res.status(200).json(weatherData);
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

            const cacheKey = `forecast:${lat},${long}`;

            // Check the cache
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            // Fetch data from OpenWeather API
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast`,
                {
                    params: {
                        lat,
                        lon: long,
                        appid: process.env.API_KEY,
                        units: 'metric'
                    },
                }
            );

            const weatherData = response.data;
            // Cache the response
            await redisClient.set(cacheKey, JSON.stringify(weatherData), {
                EX: 600, // Expire after 600 seconds
            });

            res.status(200).json(weatherData);
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

            const cacheKey = `hours_forecast:${lat},${long}`;
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            const forecast = await axios.get(`http://api.weatherapi.com/v1/forecast.json`, {
                params: {
                    key: process.env.WEATHER_API_KEY,
                    q: `${lat},${long}`
                }
            });

            await redisClient.set(cacheKey, JSON.stringify(forecast.data), {
                EX: 600, // 10 minutes
            });

            res.status(200).json(forecast.data);
        } catch (err) {;
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

            const cacheKey = `air_pollution:${lat},${long}`;

            // Check the cache
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }

            // Fetch data from OpenWeather API
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/air_pollution`,
                {
                    params: {
                        lat,
                        lon: long,
                        appid: process.env.API_KEY,
                    },
                }
            );

            const weatherData = response.data;
            // Cache the response
            await redisClient.set(cacheKey, JSON.stringify(weatherData), {
                EX: 600, // Expire after 600 seconds
            });

            res.status(200).json(weatherData);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    }
};

module.exports = weather;