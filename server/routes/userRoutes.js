const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route to create/sync user profile after Firebase registration
router.post('/register', registerUser);

// Route to get current user profile (protected)
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
