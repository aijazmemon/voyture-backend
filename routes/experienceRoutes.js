const express = require('express');
const router = express.Router();
const experienceController = require('../controller/experienceController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


// Multer configuration for file uploads
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage }); // Configure upload without calling array() here

// Route for posting an experience
router.post('/experiences', protect, upload.array('images', 3), experienceController.createExperience);

// Route for fetching experiences posted by a host
router.get('/your-posted-experiences', protect, experienceController.getHostExperiences);
router.get('/experiences', experienceController.getAllExperiences);

//Route for fetching experience details
router.get('/experiences/:id', experienceController.getExperienceById);

// Route for fetching experience details with booking count for hosts
router.get('/host-experience-details/:id', protect, experienceController.getHostExperienceById);

// Route for deleting experience
router.delete('/host-experience-details/:id', protect, experienceController.deleteExperience);

module.exports = router;
