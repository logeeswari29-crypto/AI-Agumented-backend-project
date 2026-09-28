require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = require('./app');
const connectDB = require('./config/db');


const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('AI WeatherWise API is ready.');
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();