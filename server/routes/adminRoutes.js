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


router.use(verifyToken, verifyAdmin);


router.get('/stats', getAdminStats);


router.get('/listings/pending', getPendingListings);
router.put('/listings/:id/approve', approveListing);
router.put('/listings/:id/reject', rejectListing);
router.delete('/listings/:id', adminDeleteListing);


router.get('/brokers', getBrokers);
router.put('/brokers/:id/verify', verifyBroker);
router.put('/users/:id/block', blockUser);

module.exports = router;
