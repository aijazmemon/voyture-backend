const axios = require('axios');

exports.searchHotels = async (req, res) => {
  const { checkInDate, checkOutDate, adults, regionId } = req.query;

  // Validate mandatory fields
  if (!checkInDate || !checkOutDate || !adults || !regionId) {
    return res.status(400).json({ error: "Missing required fields: checkInDate, checkOutDate, adults, regionId" });
  }

  try {
    const options = {
      method: 'GET',
      url: 'https://hotels-com-provider.p.rapidapi.com/v2/hotels/search',
      params: {
        checkin_date: checkInDate,
        checkout_date: checkOutDate,
        adults_number: adults,
        region_id: regionId,
        locale: 'en_US',
        sort_order: 'REVIEW',
        page_number: '1',
        domain: 'US',
      },
      headers: {
        'x-rapidapi-key': '474eb47bedmsh1a244a5fa656434p1b6070jsn312a789698d5',
        'x-rapidapi-host': 'hotels-com-provider.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching hotel data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch hotel data', details: error.response?.data || error.message });
  }
};
