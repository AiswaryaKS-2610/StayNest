const express = require('express');
const router = express.Router();
const { registerUser, getUserProfile } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/register', registerUser);


router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
