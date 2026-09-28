const getMockWeather = (city) => {
  const normalizedCity = city.trim();
  const hash = normalizedCity
    .toLowerCase()
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Clear', 'Windy'];
  const condition = conditions[hash % conditions.length];

  return {
    city: normalizedCity
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    temperature: Math.round(15 + (hash % 20)),
    humidity: Math.round(40 + (hash % 50)),
    windSpeed: Math.round((3 + (hash % 15)) * 10) / 10,
    condition,
    source: 'mock',
    isMock: true
  };
};

const fetchWeather = async (city) => {
  const cleanCity = String(city || '').trim();

  if (!cleanCity) {
    throw new Error('City is required');
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey.startsWith('your_')) {
    console.log(`[WeatherService] Mock weather used for ${cleanCity}`);
    return getMockWeather(cleanCity);
  }

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanCity)}` +
      `&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (response.status === 404) {
      throw new Error('City not found');
    }

    if (response.status === 401) {
      console.warn('[WeatherService] Invalid OpenWeatherMap key. Using mock data.');
      return getMockWeather(cleanCity);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Weather service request failed');
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys?.country || '',
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      condition: data.weather?.[0]?.main || 'Unknown',
      description: data.weather?.[0]?.description || '',
      source: 'openweathermap',
      isMock: false
    };
  } catch (error) {
    if (error.message === 'City not found') throw error;

    console.error(`[WeatherService] ${error.message}`);
    console.log('[WeatherService] Falling back to mock weather.');
    return getMockWeather(cleanCity);
  }
};

module.exports = { fetchWeather };
