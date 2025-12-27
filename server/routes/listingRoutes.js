const express = require('express');
const router = express.Router();
const { getListings, createListing } = require('../controllers/listingController');

router.get('/', getListings);
router.post('/', createListing);

module.exports = router;
