# AI WeatherWise API

A beginner-friendly REST API built with Node.js, Express, MongoDB/Mongoose, JWT authentication, OpenWeatherMap and Gemini AI.

## Included features
- User registration and login
- JWT protected profile endpoint
- Favorite location CRUD
- Current weather endpoint
- AI weather summary
- AI weather recommendation
- AI weather story/poem
- Mock weather fallback when OpenWeatherMap key is not configured
- Rule-based AI fallback when Gemini key is not configured
- Health-check endpoint
- Consistent JSON responses and validation

## Project structure

```text
Backend/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── postman_collection.json
├── README.md
└── src/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── aiController.js
    │   ├── authController.js
    │   ├── locationController.js
    │   └── weatherController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── Location.js
    │   └── User.js
    ├── routes/
    │   ├── aiRoutes.js
    │   ├── authRoutes.js
    │   ├── locationRoutes.js
    │   └── weatherRoutes.js
    ├── services/
    │   ├── aiService.js
    │   └── weatherService.js
    ├── app.js
    └── server.js
```

## Setup

1. Open this `Backend` folder in VS Code.
2. Make sure MongoDB is running.
3. Run:

```bash
npm install
```

4. Open `.env` and replace the placeholder API keys if you have them.
5. Start:

```bash
npm start
```

For development:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## Important

The project works without external API keys:
- No OpenWeatherMap key -> mock weather data is returned.
- No Gemini key -> local rule-based summary/recommendation/story is returned.

Never upload a real `.env` file containing secret API keys to GitHub.

## Main endpoints

### Public
- `GET /`
- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/weather/:city`

### JWT protected
- `GET /api/auth/profile`
- `POST /api/locations`
- `GET /api/locations`
- `PUT /api/locations/:id`
- `DELETE /api/locations/:id`
- `POST /api/ai/weather-summary`
- `POST /api/ai/weather-recommendation`
- `POST /api/ai/weather-story`

## Quick test

After starting the server, open:

`http://localhost:5000/health`

You should get a JSON response with `"status": "healthy"`.

Then use the included Postman collection for the complete flow: Register -> Login -> Profile -> Weather -> Locations -> AI.
