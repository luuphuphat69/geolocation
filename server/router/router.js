const resultController = require('../controller/result');
const lambdaController = require('../controller/lambdaTrigger');

const router = require('express').Router();
router.get('/location', resultController.retrieveData);
router.post('/lambda/sub', lambdaController.writetodb);
router.get('/lambda/unsub', lambdaController.unsubcribe);
module.exports = router;