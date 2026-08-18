const Donation = require("../models/Donation");
const User = require("../models/User");
const { sendMail } = require("../utils/Emails");

// Create a new donation
exports.createDonation = async (req, res) => {
  try {
    const donationData = {
      ...req.body,
      donor: req.user._id,
      status: 'pending'
    };

    const donation = new Donation(donationData);
    await donation.save();

    // Send confirmation email to donor
    try {
      await sendMail(
        donation.donorEmail,
        '📚 Book Donation Confirmation - The Lending Library',
        `
          <h2>Thank you for your donation!</h2>
          <p>Dear ${donation.donorName},</p>
          <p>We have received your book donation request for "<strong>${donation.bookTitle}</strong>" by ${donation.author}.</p>
          <p><strong>Donation Details:</strong></p>
          <ul>
            <li>Book: ${donation.bookTitle}</li>
            <li>Author: ${donation.author}</li>
            <li>Quantity: ${donation.quantity}</li>
            <li>Condition: ${donation.condition}</li>
            <li>Pickup Preference: ${donation.pickupPreference === 'pickup' ? '🚚 Request Pickup' : '🏢 Drop Off'}</li>
          </ul>
          <p>We'll contact you within 24-48 hours to confirm the pickup.</p>
          <br/>
          <p>📚 The Lending Library Team</p>
          <p><small>If you have any questions, please contact us at support@thelendinglibrary.com</small></p>
        `
      );
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }

    // Send notification to admin
    try {
      const adminUsers = await User.find({ isAdmin: true });
      for (const admin of adminUsers) {
        await sendMail(
          admin.email,
          '📚 New Book Donation Received!',
          `
            <h2>New Donation Received!</h2>
            <p><strong>Book:</strong> ${donation.bookTitle}</p>
            <p><strong>Author:</strong> ${donation.author}</p>
            <p><strong>Donor:</strong> ${donation.donorName}</p>
            <p><strong>Email:</strong> ${donation.donorEmail}</p>
            <p><strong>Phone:</strong> ${donation.donorPhone}</p>
            <p><strong>Quantity:</strong> ${donation.quantity}</p>
            <p><strong>Condition:</strong> ${donation.condition}</p>
            <p><strong>Pickup:</strong> ${donation.pickupPreference === 'pickup' ? '🚚 Request Pickup' : '🏢 Drop Off'}</p>
            <br/>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/donations">View Donations</a>
          `
        );
      }
    } catch (adminEmailError) {
      console.error('Admin email send error:', adminEmailError);
    }

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
};

// Get all donations (admin only)
exports.getAllDonations = async (req, res) => {
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
};

// Get user's own donations
exports.getMyDonations = async (req, res) => {
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
};

// Get single donation by ID (admin only)
exports.getDonationById = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      success: true,
      donation
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation',
      error: error.message
    });
  }
};

// Update donation status (admin only)
exports.updateDonationStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    donation.status = status;
    await donation.save();

    // Send email notification to donor about status update
    try {
      const statusMessages = {
        confirmed: 'Your donation has been confirmed! We will arrange for pickup soon.',
        picked_up: 'Your donation has been picked up! Thank you for your contribution.',
        delivered: 'Your donation has been delivered to our library! Thank you for supporting literacy.',
        cancelled: 'Your donation request has been cancelled. Please contact us if you have any questions.'
      };

      await sendMail(
        donation.donorEmail,
        `📚 Donation Status Update - ${donation.bookTitle}`,
        `
          <h2>Donation Status Updated</h2>
          <p>Dear ${donation.donorName},</p>
          <p>Your donation "<strong>${donation.bookTitle}</strong>" status has been updated to:</p>
          <h3 style="color: #1976d2;">${status.toUpperCase()}</h3>
          <p>${statusMessages[status] || 'Your donation status has been updated.'}</p>
          <br/>
          <p>📚 The Lending Library Team</p>
        `
      );
    } catch (emailError) {
      console.error('Status update email error:', emailError);
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
};

// Delete donation (admin only)
exports.deleteDonation = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete donation',
      error: error.message
    });
  }
};