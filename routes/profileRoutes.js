const express = require('express');
const router = express.Router();
const { viewProfile } = require('../controller/profileController');

router.get('/:id', viewProfile);

module.exports = router;
