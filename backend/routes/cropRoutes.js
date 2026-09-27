const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', cropController.getAllCrops);
router.get('/:id', cropController.getCropById);

// Admin only routes
router.use(auth, adminAuth);
router.post('/', cropController.addCrop);
router.put('/:id', cropController.updateCrop);
router.delete('/:id', cropController.deleteCrop);

module.exports = router;
