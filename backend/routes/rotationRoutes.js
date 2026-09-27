const express = require('express');
const router = express.Router();
const rotationController = require('../controllers/rotationController');
const auth = require('../middleware/auth');

router.post('/recommend', auth, rotationController.getRotationRecommendation);

module.exports = router;
