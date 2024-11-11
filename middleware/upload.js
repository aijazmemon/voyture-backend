const multer = require('multer');
const path = require('path');

// Multer Configuration for Uploading Aadhar and Selfie
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
router.post('/', upload.single('image'), experienceController.createExperience);

module.exports = upload;
