import axios from 'axios';

const BASE_URL = "http://localhost:3000/v1";

export const getLocation = (queries) => {
    return axios.get(`${BASE_URL}/location`, {
        params: {
            queries
        }
    });
};

export const getCurrentWeather = (lat, long) => {
    return axios.get(`${BASE_URL}/weather/current`, {
        params: {
            lat,
            long,
        }
    });
};

export const getForecast = (lat, long) => {
    return axios.get(`${BASE_URL}/weather/forecast`, {
        params: {
            lat,
            long,
        }
    });
};

export const getAirPolution = (lat, long) => {
    return axios.get(`${BASE_URL}/weather/airpollution`, {
        params: {
            lat,
            long,
        }
    });
};