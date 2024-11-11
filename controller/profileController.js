const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Update Profile with Profile Picture
const updateProfileWithPicture = async (req, res) => {
    try {
        const { id } = req.params; // Use "id" instead of "userId"
        const updates = req.body;

        // Check if a file is uploaded
        if (req.file) {
            // Upload the image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            updates.profilePicture = result.secure_url; // Add Cloudinary image URL
        }

        // Update user profile in the database
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

// View Profile
const viewProfile = async (req, res) => {
    try {
        const { id } = req.params; // Use "id" instead of "userId"
        const user = await User.findById(id).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

// Update Profile without Picture
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params; // Use "id" instead of "userId"
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

module.exports = {
    viewProfile,
    updateProfile,
    updateProfileWithPicture, // Export the function to update profile with picture
};
