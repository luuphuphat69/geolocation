const resultController = require('../controller/result');
const lambdaController = require('../controller/lambdaTrigger');

const router = require('express').Router();
router.get('/location', resultController.retrieveData);
router.post('/lambda', lambdaController.writetodb);
module.exports = router;