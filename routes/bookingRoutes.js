// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getUserBookings, deleteBooking } = require('../controller/bookingController');
const protect = require('../middleware/authMiddleware').protect;

const router = express.Router();

// Route to create a booking
router.post('/', protect, createBooking);

// Route to get all bookings for a user
router.get('/', protect, getUserBookings);

// Route to delete a booking
router.delete('/:id', protect, deleteBooking);

module.exports = router;
