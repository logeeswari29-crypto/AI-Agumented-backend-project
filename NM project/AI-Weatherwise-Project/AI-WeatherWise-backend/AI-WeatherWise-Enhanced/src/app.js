const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI WeatherWise API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      weather: '/api/weather',
      locations: '/api/locations',
      ai: '/api/ai'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    service: 'AI WeatherWise API',
    time: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((error, req, res, next) => {
  console.error('[Server Error]', error.stack || error.message);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

module.exports = app;
