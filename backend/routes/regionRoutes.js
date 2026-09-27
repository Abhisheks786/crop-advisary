const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

router.get('/', regionController.getAllRegions);
router.get('/:state', regionController.getRegionsByState);

module.exports = router;
