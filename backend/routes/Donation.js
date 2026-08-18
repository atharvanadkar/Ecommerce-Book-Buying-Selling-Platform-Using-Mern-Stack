const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { verifyToken } = require('../middleware/VerifyToken');

// Get all donations (admin only)
router.get('/admin/donations', verifyToken, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const donations = await Donation.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            donations
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch donations',
            error: error.message
        });
    }
});

// Update donation status (admin only)
router.put('/admin/donations/:id/status', verifyToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        const { status } = req.body;
        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Donation status updated to ${status}`,
            donation
        });
    } catch (error) {
        console.error('Error updating donation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update donation status',
            error: error.message
        });
    }
});

// Create a new donation
router.post('/donate', verifyToken, async (req, res) => {
    try {
        const donationData = {
            ...req.body,
            donor: req.user._id,
            status: 'pending'
        };

        const donation = new Donation(donationData);
        await donation.save();

        res.status(201).json({
            success: true,
            message: 'Donation submitted successfully',
            donation
        });
    } catch (error) {
        console.error('Donation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit donation',
            error: error.message
        });
    }
});

// Get user's own donations
router.get('/my-donations', verifyToken, async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            donations
        });
    } catch (error) {
        console.error('Error fetching my donations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your donations',
            error: error.message
        });
    }
});

module.exports = router;