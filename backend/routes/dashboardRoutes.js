const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/statistics', dashboardController.getStatistics);
router.get('/recent', dashboardController.getRecentRecommendations);

module.exports = router;
