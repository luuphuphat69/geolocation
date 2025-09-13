const axios = require('axios');
const cache = require('../cache');

const weather = {
  GetCurrentWeatherData: async (req, res) => {
    try {
      const lat = req.query.lat;
      const long = req.query.long;

      if (!lat || !long) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
      }

      const cacheKey = `current_weather:${lat},${long}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
        params: {
          lat,
          lon: long,
          exclude: 'hourly,daily',
          appid: process.env.OPENWEATHER_API_KEY,
        },
      });

      cache.set(cacheKey, response.data, 600); // cache for 10 minutes
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

      const cacheKey = `forecast:${lat},${long}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          lat,
          lon: long,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric',
        },
      });

      cache.set(cacheKey, response.data, 600);
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

      const cacheKey = `hours_forecast:${lat},${long}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      const forecast = await axios.get(`http://api.weatherapi.com/v1/forecast.json`, {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: `${lat},${long}`,
        },
      });

      cache.set(cacheKey, forecast.data, 600);
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

      const cacheKey = `air_pollution:${lat},${long}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution`, {
        params: {
          lat,
          lon: long,
          appid: process.env.OPENWEATHER_API_KEY,
        },
      });

      cache.set(cacheKey, response.data, 600);
      res.status(200).json(response.data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  },
};

module.exports = weather;