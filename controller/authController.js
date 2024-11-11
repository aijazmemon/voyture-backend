// authController.js
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { emailOrPhone, password } = req.body; 

  console.log("Login attempt with:", { emailOrPhone, password }); // Log the incoming data
  
  try {
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Login failed: User not found' });
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, user.password);
    console.log("Password entered:", password);  // Log the plain password entered
    console.log("Hashed password in DB:", user.password);  // Log the hashed password from DB
    console.log("Password match result:", isMatch);  // Log whether passwords match or not

    if (!isMatch) {
      return res.status(401).json({ message: 'Login failed: Incorrect password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });


    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
};


module.exports = { loginUser };
