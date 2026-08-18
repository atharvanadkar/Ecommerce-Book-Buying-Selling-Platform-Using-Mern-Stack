const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ['new', 'good', 'fair', 'poor'],
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    donorName: {
        type: String,
        required: true,
        trim: true
    },
    donorEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    donorPhone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true
    },
    pickupPreference: {
        type: String,
        enum: ['pickup', 'dropoff'],
        default: 'pickup'
    },
    additionalNotes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'picked_up', 'delivered', 'cancelled'],
        default: 'pending'
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', donationSchema);