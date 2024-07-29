const express = require('express');
const router = express.Router();
const { runTests } = require('../controllers/testController');

router.get('/run-tests', runTests);

module.exports = router;
