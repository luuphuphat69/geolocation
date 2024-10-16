const resultController = require('../controller/result');
const router = require('express').Router();
router.get('/location', resultController.retrieveData);

module.exports = router;