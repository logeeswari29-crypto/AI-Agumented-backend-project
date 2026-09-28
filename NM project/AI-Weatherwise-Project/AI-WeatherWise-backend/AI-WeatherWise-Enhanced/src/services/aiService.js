const { GoogleGenerativeAI } = require('@google/generative-ai');

const hasGeminiKey = () => {
  return Boolean(process.env.GEMINI_API_KEY);
};
const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  });
};

const generateLocalSummary = (city, temperature, humidity, condition) => {
  const tempWord =
    temperature >= 30 ? 'warm' :
    temperature <= 15 ? 'cool' : 'pleasant';

  const humidityWord =
    humidity >= 70 ? 'high' :
    humidity <= 40 ? 'low' : 'moderate';

  return `The weather in ${city} is ${tempWord} and ${String(condition).toLowerCase()} with ${humidityWord} humidity.`;
};

const generateLocalRecommendation = (temperature, condition) => {
  const recommendations = [];
  const weather = String(condition).toLowerCase();

  if (temperature >= 30) {
    recommendations.push('stay hydrated', 'wear light cotton clothes');
  } else if (temperature <= 15) {
    recommendations.push('wear warm layers', 'prefer warm drinks');
  } else {
    recommendations.push('wear comfortable clothes', 'outdoor activities should be pleasant');
  }

  if (
    weather.includes('rain') ||
    weather.includes('drizzle') ||
    weather.includes('storm')
  ) {
    recommendations.push('carry an umbrella or raincoat');
  }

  if (weather.includes('sun') || weather.includes('clear')) {
    recommendations.push('use sunscreen when spending time outdoors');
  }

  return `${recommendations[0].charAt(0).toUpperCase()}${recommendations.slice(1).join(', ')}.`;
};

const storyTemplates = {
  Sunny: 'Golden sunlight warmed {city}, turning the {temp}°C day into a bright little adventure.',
  Cloudy: 'Soft clouds gathered above {city}, giving the {temp}°C day a calm and peaceful mood.',
  Rainy: 'Rain danced across {city}, while the {temp}°C air made every street feel like part of a story.',
  Clear: 'A clear sky stretched over {city}, shining quietly above the {temp}°C streets.',
  Windy: 'A playful wind moved through {city}, carrying cool {temp}°C air from one street to another.'
};

const generateLocalStory = (city, temperature, condition, style = 'story') => {
  const key =
    Object.keys(storyTemplates).find(
      item => item.toLowerCase() === String(condition).toLowerCase()
    ) || 'Clear';

  const base = storyTemplates[key]
    .replace('{city}', city)
    .replace('{temp}', temperature);

  if (style === 'poem') {
    return `${city} wakes beneath a ${String(condition).toLowerCase()} sky,\n` +
      `${temperature}°C whispers as the hours pass by,\n` +
      `The weather paints a scene so bright,\n` +
      `A little moment, calm and light.`;
  }

  return base;
};

const askGemini = async (prompt) => {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return (await result.response).text().trim();
};

const generateSummary = async (city, temperature, humidity, condition) => {
  if (!hasGeminiKey()) {
    return generateLocalSummary(city, temperature, humidity, condition);
  }

  try {
    const text = await askGemini(
      `Give a concise 1-2 sentence weather summary.
City: ${city}
Temperature: ${temperature}°C
Humidity: ${humidity}%
Condition: ${condition}
Return only plain text.`
    );

    return text || generateLocalSummary(city, temperature, humidity, condition);
  } catch (error) {
    console.error('[AIService] Summary error:', error.message);
    return generateLocalSummary(city, temperature, humidity, condition);
  }
};

const generateRecommendation = async (temperature, condition) => {
  if (!hasGeminiKey()) {
    return generateLocalRecommendation(temperature, condition);
  }

  try {
    const text = await askGemini(
      `Give practical weather recommendations in 1-2 friendly sentences.
Temperature: ${temperature}°C
Condition: ${condition}
Mention clothing, hydration, or outdoor activity when relevant.
Return only plain text.`
    );

    return text || generateLocalRecommendation(temperature, condition);
  } catch (error) {
    console.error('[AIService] Recommendation error:', error.message);
    return generateLocalRecommendation(temperature, condition);
  }
};

const generateStory = async (city, temperature, condition, style = 'story') => {
  if (!hasGeminiKey()) {
    return generateLocalStory(city, temperature, condition, style);
  }

  try {
    const instruction =
      style === 'poem'
        ? 'Write a creative 4-line poem.'
        : 'Write a short imaginative 3-4 sentence story.';

    const text = await askGemini(
      `${instruction}
City: ${city}
Temperature: ${temperature}°C
Condition: ${condition}
Do not use markdown, title, or hashtags.`
    );

    return text || generateLocalStory(city, temperature, condition, style);
  } catch (error) {
    console.error('[AIService] Story error:', error.message);
    return generateLocalStory(city, temperature, condition, style);
  }
};

/* AI CHATBOT */
const generateChatResponse = async (message, city, history = []) => {
  if (!hasGeminiKey()) {
    throw new Error('Gemini API key is not configured');
  }

  const chatHistory = Array.isArray(history)
    ? history
        .slice(-10)
        .map(item => `${item.role}: ${item.content}`)
        .join('\n')
    : '';

  const prompt = `
You are WeatherWise AI, a friendly weather assistant.

User message:
${message}

City:
${city || 'Not provided'}

Previous conversation:
${chatHistory || 'No previous conversation'}

Answer the user's question clearly and naturally.
Give useful weather-related advice when appropriate.
Do not invent current weather information.
Keep the answer simple and helpful.
Return only normal text.
`;

  return await askGemini(prompt);
};

module.exports = {
  generateSummary,
  generateRecommendation,
  generateStory,
  generateChatResponse
};