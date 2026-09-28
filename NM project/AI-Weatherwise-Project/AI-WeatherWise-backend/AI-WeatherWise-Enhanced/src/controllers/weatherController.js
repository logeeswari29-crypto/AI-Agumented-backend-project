const { fetchWeather } = require('../services/weatherService');

const getWeather = async (req, res) => {
  try {
    const city = decodeURIComponent(req.params.city || '').trim();

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City name is required'
      });
    }

    const weather = await fetchWeather(city);

    return res.status(200).json({
      success: true,
      message: 'Weather fetched successfully',
      data: weather
    });
  } catch (error) {
    const status = error.message === 'City not found' ? 404 : 500;

    return res.status(status).json({
      success: false,
      message: error.message || 'Unable to fetch weather'
    });
  }
};

module.exports = { getWeather };
