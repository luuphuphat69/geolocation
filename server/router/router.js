const locationController = require('../controller/location');
const lambdaController = require('../controller/lambdaTrigger');
const weatherController = require('../controller/weather');

const router = require('express').Router();
router.get('/location', locationController.retrieveData);

router.post('/lambda/sub', lambdaController.writetodb);
router.get('/lambda/unsub', lambdaController.unsubcribe);

router.get('/weather/current', weatherController.GetCurrentWeatherData);
router.get('/weather/forecast', weatherController.GetWeatherForecastData);
router.get('/weather/airpollution', weatherController.GetAirPollutionData);
module.exports = router;