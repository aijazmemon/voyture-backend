// controllers/bookingController.js
const Booking = require('../models/Booking');
const Experience = require('../models/Experience');

// Create a new booking
// controllers/bookingController.js
exports.createBooking = async (req, res) => {
    try {
        const { experienceId, date, timeSlot, guests } = req.body; // Accept date and timeSlot from request body

        const experience = await Experience.findById(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        const booking = new Booking({
            user: req.user._id,
            experience: experienceId,
            date: new Date(date), // Save the date
            timeSlot,
            guests // Save the time slot
        });

        await booking.save();
        res.status(201).json({ message: 'Booking successful', booking });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ message: 'Error creating booking', error: err.message || 'Internal Server Error' });
    }
};


// Get user bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('experience');
        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error retrieving bookings:', err); // Log error for debugging
        res.status(500).json({ message: 'Error retrieving bookings', error: err.message || 'Internal Server Error' });
    }
};


// Delete a booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Optional: Ensure the booking belongs to the authenticated user
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this booking' });
        }

        // Corrected deletion method
        await booking.deleteOne();
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error('Error deleting booking:', err);
        res.status(500).json({ message: 'Error deleting booking', error: err.message || 'Internal Server Error' });
    }
};

