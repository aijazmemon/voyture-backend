const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const User = require('../models/User');
const router = express.Router();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Multer setup for image storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'voyture_host_verification',
    format: async () => 'png', // Optional: Specify image format
  },
});

const upload = multer({ storage: storage });

// Signup Route
router.post('/signup', async (req, res) => {
  const { fullName, email, phone, password, isHost, profession, location } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
     const newUser = new User({
      fullName,
      email,
      phone,
      password,
      isHost,
      profession: isHost ? profession : undefined,
      location: isHost ? location : undefined,
    });

    // Save user
    await newUser.save();

    // Send OTP using Twilio
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: `+${phone}`, channel: 'sms' });

    console.log(`OTP sent to ${phone}: ${verification.sid}`);
    res.status(200).json({ message: 'Signup successful, OTP sent', userId: newUser._id });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed', error });
  }
});


const { loginUser } = require('../controller/authController');

// Login route
router.post('/login', loginUser);


// OTP Verification Route
router.post('/verify-otp', upload.single('selfie'), async (req, res) => {
  const { phone, otp, userId, aadharCard } = req.body;

  try {
    // Verify OTP
    const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: `+${phone}`, code: otp });

    if (verificationCheck.status === 'approved') {
      // OTP verified successfully

      // Get the URL of the uploaded selfie
      const selfieUrl = req.file ? req.file.path : null;

      // Log Aadhar card and selfie URL for debugging
      console.log('Aadhar Card Number:', aadharCard);
      console.log('Selfie URL:', selfieUrl);

      // Update user with verification status, aadharCard number, and selfie URL
      await User.findByIdAndUpdate(userId, { verified: true, aadharCard, selfie: selfieUrl });
      res.status(200).json({ message: 'OTP verified successfully', success: true });
    } else {
      res.status(400).json({ message: 'Invalid OTP', success: false });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'OTP verification failed', error });
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
