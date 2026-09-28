const {
  generateSummary,
  generateRecommendation,
  generateStory,
  generateChatResponse
} = require('../services/aiService');

const getWeatherSummary = async (req, res) => {
  try {
    const { city, temperature, humidity, condition } = req.body;

    if (!city || temperature === undefined || humidity === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'city, temperature, humidity and condition are required'
      });
    }

    const summary = await generateSummary(
      city,
      Number(temperature),
      Number(humidity),
      condition
    );

    return res.status(200).json({
      success: true,
      message: 'AI weather summary generated',
      data: { city, summary }
    });
 } catch (error) {
  console.error('[AIController] Chatbot error:', error.message);

  return res.status(500).json({
    success: false,
    message: error.message
  });
}
};

const getWeatherRecommendation = async (req, res) => {
  try {
    const { temperature, condition } = req.body;

    if (temperature === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'temperature and condition are required'
      });
    }

    const recommendation = await generateRecommendation(
      Number(temperature),
      condition
    );

    return res.status(200).json({
      success: true,
      message: 'AI weather recommendation generated',
      data: { recommendation }
    });
  } catch (error) {
    console.error('[AIController] Recommendation error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to generate recommendation'
    });
  }
};

const getWeatherStory = async (req, res) => {
  try {
    const { city, temperature, condition, style = 'story' } = req.body;

    if (!city || temperature === undefined || !condition) {
      return res.status(400).json({
        success: false,
        message: 'city, temperature and condition are required'
      });
    }

    const selectedStyle = String(style).toLowerCase();

    if (!['story', 'poem'].includes(selectedStyle)) {
      return res.status(400).json({
        success: false,
        message: 'style must be either "story" or "poem"'
      });
    }

    const story = await generateStory(
      city,
      Number(temperature),
      condition,
      selectedStyle
    );

    return res.status(200).json({
      success: true,
      message: `AI weather ${selectedStyle} generated`,
      data: { city, style: selectedStyle, story }
    });
  } catch (error) {
    console.error('[AIController] Story error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to generate weather story'
    });
  }
};
const chatWithWeatherAI = async (req, res) => {
  try {
    const { message, city, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const reply = await generateChatResponse(
      message,
      city,
      history
    );

    return res.status(200).json({
      success: true,
      message: 'AI chatbot response generated',
      data: {
        reply,
        city: city || null
      }
    });

  } catch (error) {
    console.error('[AIController] Chatbot error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to generate chatbot response'
    });
  }
};
module.exports = {
  getWeatherSummary,
  getWeatherRecommendation,
  getWeatherStory,
  chatWithWeatherAI
};