// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: { type: String, required: true },
  guests: { type: Number, required: true }
});

module.exports = mongoose.model('Booking', bookingSchema);
