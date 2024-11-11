const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const experienceRoutes = require('./routes/experienceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const path = require('path');
const hotelRoutes = require('./routes/hotelRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://voyture.vercel.app', 'http://localhost:3000'],
}));

app.use(express.json());

app.use(bodyParser.json());



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/profile', require('./routes/profileRoutes'));

// Experience routes
app.use('/api', experienceRoutes);

// Booking routes
app.use('/api/bookings', bookingRoutes);

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//image
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Hotel Routes
app.use('/api', hotelRoutes);
