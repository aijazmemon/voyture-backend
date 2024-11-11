const Experience = require('../models/Experience');
const Booking = require('../models/Booking'); 


// Create a new experience
exports.createExperience = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    const { title, description, country, state, city, price, availableDates } = req.body;
    const imagePaths = req.files.map(file => file.path);

    const experience = new Experience({
      title,
      description,
      country,
      state,
      city,
      price,
      availableDates,
      images: imagePaths,
      host: req.user.id,
    });

    await experience.save();
    res.status(201).json({ message: 'Experience posted successfully', experience });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ message: 'Error creating experience', error });
  }
};

// Get experiences posted by the logged-in host
exports.getHostExperiences = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  try {
    const hostId = req.user.id;
    const experiences = await Experience.find({ host: hostId });
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Failed to retrieve experiences.' });
  }
};

// Get all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Failed to retrieve experiences.' });
  }
};

// Get experience by ID
exports.getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Include booking count only if `includeBookings` is true
    if (req.query.includeBookings === 'true') {
      const bookingsCount = await Booking.countDocuments({ experience: req.params.id });
      return res.status(200).json({ experience, bookingsCount });
    }

    // For requests without booking information
    res.status(200).json({ experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



// GET Host Experience By Id
exports.getHostExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Retrieve the booking count only for hosts
    const bookingsCount = await Booking.countDocuments({ experience: req.params.id });
    res.status(200).json({ experience, bookingsCount });
  } catch (error) {
    console.error('Error fetching host experience:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



// Delete an experience by ID (only for the host who created it)
exports.deleteExperience = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  try {
    const experience = await Experience.findOneAndDelete({
      _id: req.params.id,
      host: req.user.id,  // Ensures that only the host who created it can delete
    });

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found or not authorized to delete.' });
    }

    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Failed to delete experience' });
  }
};
