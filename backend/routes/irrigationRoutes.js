const express = require('express');
const router = express.Router();
const irrigationController = require('../controllers/irrigationController');
const auth = require('../middleware/auth');

router.post('/calculate', auth, irrigationController.calculateIrrigation);

module.exports = router;
