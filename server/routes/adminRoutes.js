const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
    getPendingListings,
    approveListing,
    rejectListing,
    adminDeleteListing,
    getBrokers,
    verifyBroker,
    blockUser,
    getAdminStats
} = require('../controllers/adminController');

// All routes here require Admin role
router.use(verifyToken, verifyAdmin);

// Dashboard Stats
router.get('/stats', getAdminStats);

// Listing Review
router.get('/listings/pending', getPendingListings);
router.put('/listings/:id/approve', approveListing);
router.put('/listings/:id/reject', rejectListing);
router.delete('/listings/:id', adminDeleteListing);

// Broker Management
router.get('/brokers', getBrokers);
router.put('/brokers/:id/verify', verifyBroker);
router.put('/users/:id/block', blockUser);

module.exports = router;
