import axios from 'axios';

const prodURL = "https://geolocation-server-xfs4.onrender.com/v1";
const localURL = "http://localhost:3000/v1";

const BASE_URL = prodURL;
//const BASE_URL = localURL;

const lambdaAPI_ID = ["qnwo61w86a", "fl67rvmwfa"];
const lambdaAPI_stage = "default";
const lambdaAPI_path = ["sendDeactiveMail", "writetodb"];

export const SendActivasion = async (mail, city, lat, long) => {
    try {
        const res = await axios.post(
            `https://${lambdaAPI_ID[1]}.execute-api.us-east-1.amazonaws.com/${lambdaAPI_stage}/${lambdaAPI_path[1]}`,
            { mail, lat, long, city },
            { headers: { "Content-Type": "application/json" } }
        );
        // console.log("Success:", res.data);
        return res;
    } catch (err) {
        //console.error("Error:", err.response?.data || err.message);
        return err.response;
    }
};

export const unsubcribeNotify = async(id, mail) => {
    try {
        const res = await axios.post(
            `https://${lambdaAPI_ID[0]}.execute-api.us-east-1.amazonaws.com/${lambdaAPI_stage}/${lambdaAPI_path[0]}`,
            { mail, id },
            { headers: { "Content-Type": "application/json" } }
        );
        //console.log("Success:", res.data);
        return res;
    } catch (err) {
        //console.error("Error:", err.response?.data || err.message);
        return err.response;
    }
}

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
        //console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export const deleteFCMTokenFromServer = async (token) => {
    try {
        const response = await axios.delete(`${BASE_URL}/FCM/token`,{
            data: { token }
        });
        //console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export const reverseGeocoding =  (lat, lon) => {
    try{
        return axios.get(`${BASE_URL}/location/reverse-geocoding`, {
            params:{
                lat,
                lon
            }
        })
    }catch(err){
        console.log(err)
    }
}