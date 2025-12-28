const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Broker routes
router.post('/', verifyToken, verificationController.submitVerification);
router.get('/my-verification', verifyToken, verificationController.getMyVerification);

// Admin routes
router.get('/', verifyToken, verifyAdmin, verificationController.getAllVerifications);
router.put('/:id/approve', verifyToken, verifyAdmin, verificationController.approveVerification);
router.put('/:id/reject', verifyToken, verifyAdmin, verificationController.rejectVerification);

module.exports = router;
