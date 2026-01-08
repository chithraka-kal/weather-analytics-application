const axios = require('axios');
const fs = require('fs');
const path = require('path');
const NodeCache = require('node-cache'); 
const { calculateComfortIndex } = require('./scoringService');


const weatherCache = new NodeCache({ stdTTL: 300 });

//Extract city codes
const getCityIds = () => {
    const filePath = path.join(__dirname, '../data/cities.json');
    const rawData = fs.readFileSync(filePath);
    const cities = JSON.parse(rawData).List;
    return cities.map(city => city.CityCode);
};

//fetch weather data for single city
const fetchWeatherForCity = async (cityId) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;
    
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch for ID ${cityId}:`, error.message);
        return null;
    }
};

//main function

    //caching
const getWeatherData = async () => {
    const cacheKey = "weather_data_sorted";
    
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
        console.log("[CACHE] HIT - Serving data from memory."); 
        return cachedData;
    }

    console.log("[CACHE] MISS - Fetching new data from API...");
    
    //raw data fetching
    const cityIds = getCityIds();
    const weatherPromises = cityIds.map(id => fetchWeatherForCity(id));
    const rawWeatherData = await Promise.all(weatherPromises);
    const validData = rawWeatherData.filter(data => data !== null);

    //data processing
    const processedData = validData.map(city => {
        const score = calculateComfortIndex(city);
        return {
            id: city.id,
            name: city.name,
            weather: city.weather[0].main,
            description: city.weather[0].description,
            temp: city.main.temp,
            humidity: city.main.humidity,
            windSpeed: city.wind.speed,
            comfortIndex: score
        };
    });

    //sorting byy the score
    processedData.sort((a, b) => b.comfortIndex - a.comfortIndex);

    const finalData = processedData.map((city, index) => ({
        ...city,
        rank: index + 1
    }));

    //set the cache for 5 minutes
    weatherCache.set(cacheKey, finalData);
    
    return finalData;
};

// debug endpoint to show cache status
const getCacheStats = () => {
    return weatherCache.getStats();
};

module.exports = { getWeatherData, getCacheStats };