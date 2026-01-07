const { getWeatherData, getCacheStats } = require('./services/weatherService');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Security Check 
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// Public Route 
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Protected Route 
app.get('/api/protected', checkJwt, (req, res) => {
  res.json({ message: "Success! You are authenticated." });
});

// Test Route 
app.get('/api/weather', async (req, res) => {
    try {
        console.log("Fetching weather data...");
        const data = await getWeatherData();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

app.get('/api/weather/debug', (req, res) => {
    const stats = getCacheStats();
    res.json({
        status: "Cache Active",
        stats: stats
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});