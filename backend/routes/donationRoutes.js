const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken } = require('../middleware/VerifyToken');

// Protected routes (require authentication)
router.post('/donate', verifyToken, donationController.createDonation);
router.get('/my-donations', verifyToken, donationController.getMyDonations);

// Admin only routes
router.get('/admin/donations', verifyToken, donationController.getAllDonations);
router.get('/admin/donations/:id', verifyToken, donationController.getDonationById);
router.put('/admin/donations/:id/status', verifyToken, donationController.updateDonationStatus);
router.delete('/admin/donations/:id', verifyToken, donationController.deleteDonation);

module.exports = router;