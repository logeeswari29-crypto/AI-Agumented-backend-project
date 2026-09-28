const express = require('express');

const {
  getWeatherSummary,
  getWeatherRecommendation,
  getWeatherStory,
  chatWithWeatherAI
} = require('../controllers/aiController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/weather-summary', getWeatherSummary);
router.post('/weather-recommendation', getWeatherRecommendation);
router.post('/weather-story', getWeatherStory);
router.post('/chat', chatWithWeatherAI);

module.exports = router;