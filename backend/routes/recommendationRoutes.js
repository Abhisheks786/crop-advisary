const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', recommendationController.generateRecommendation);
router.get('/', recommendationController.getUserRecommendations);
router.get('/:id', recommendationController.getRecommendationById);

module.exports = router;
