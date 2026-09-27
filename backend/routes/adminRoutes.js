const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.use(auth, adminAuth);

router.get('/statistics', adminController.getAdminStatistics);
router.get('/recommendations', adminController.getAllRecommendations);
router.get('/scoring-weights', adminController.getScoringWeights);
router.put('/scoring-weights', adminController.updateScoringWeights);

module.exports = router;
