const locationController = require('../controller/location');
const weatherController = require('../controller/weather');
const FCMController = require('../controller/FCMController');

const router = require('express').Router();
router.get('/location', locationController.retrieveData);
router.get('/location/reverse-geocoding', locationController.reverseGeocoding);

router.get('/weather/current', weatherController.GetCurrentWeatherData);
router.get('/weather/forecast', weatherController.GetWeatherForecastData);
router.get('/weather/forecast/hourly', weatherController.GetHoursForecastData)
router.get('/weather/airpollution', weatherController.GetAirPollutionData);

router.post('/FCM/token', FCMController.saveToken);
router.delete('/FCM/token', FCMController.deleteToken);
module.exports = router;