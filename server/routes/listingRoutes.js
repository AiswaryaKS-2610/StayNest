const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getListings, getBrokerListings, createListing, updateListing, incrementViewCount } = require('../controllers/listingController');

router.get('/', getListings);
router.get('/broker', verifyToken, getBrokerListings);
router.post('/', verifyToken, createListing);
router.put('/:id', verifyToken, updateListing);
router.put('/:id/view', incrementViewCount);

module.exports = router;
