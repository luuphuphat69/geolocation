import axios from 'axios';

const prodURL = "https://geolocation-server-xfs4.onrender.com";
const localURL = "http://localhost:3000/v1";

const BASE_URL = prodURL;

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

export const getHourlyForecast = (lat, long) => {
    return axios.get(`${BASE_URL}/weather/forecast/hourly`, {
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

export const unsubLambda = (id, mail) => {
    return axios.get(`${BASE_URL}/lambda/unsub`, {
        params: {
            id: id,
            mail: mail
        }
    })
}

export const subLambda = (mail, lat, long, city) => {
    return axios.post(`${BASE_URL}/lambda/sub`, {
        params: {
            mail: mail,
            lat: lat,
            long: long,
            city: city
        }
    })
}

export const sendTokenToServer = async (token, lat, lon) => {
    try {
        const response = await axios.post(`${BASE_URL}/FCM/token`, {
            token: token,
            lat: lat,
            lon: lon,
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}