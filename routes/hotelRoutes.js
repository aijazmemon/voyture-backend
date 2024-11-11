const express = require('express');
const router = express.Router();
const { searchHotels } = require('../controller/hotelController');

router.get('/search-hotels', searchHotels);

module.exports = router;
