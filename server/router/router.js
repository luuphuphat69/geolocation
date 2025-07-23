const locationController = require('../controller/location');
const lambdaController = require('../controller/lambdaTrigger');
const weatherController = require('../controller/weather');
const FCMController = require('../controller/FCMController');

const router = require('express').Router();
router.get('/location', locationController.retrieveData);

router.post('/lambda/sub', lambdaController.writetodb);
router.get('/lambda/unsub', lambdaController.unsubcribe);

router.get('/weather/current', weatherController.GetCurrentWeatherData);
router.get('/weather/forecast', weatherController.GetWeatherForecastData);
router.get('/weather/forecast/hourly', weatherController.GetHoursForecastData)
router.get('/weather/airpollution', weatherController.GetAirPollutionData);

router.post('/FCM/token', FCMController.saveToken);
module.exports = router;