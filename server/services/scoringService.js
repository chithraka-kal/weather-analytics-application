const calculateComfortIndex = (weather) => {
    let score = 100;
    
    // Temperature
    const idealTemp = 24;
    const currentTemp = weather.main.temp;
    const tempDiff = Math.abs(currentTemp - idealTemp);
    score -= (tempDiff * 2);

    // Humidity 
    const idealHumidity = 50;
    const currentHumidity = weather.main.humidity;
    const humidityDiff = Math.abs(currentHumidity - idealHumidity);
    score -= (humidityDiff * 0.5);

    // Wind Speed
    const idealWind = 3;
    const currentWind = weather.wind.speed;
    const windDiff = Math.abs(currentWind - idealWind);
    score -= (windDiff * 0.2);

    return Math.max(0, Math.min(100, Math.round(score)));
};

module.exports = { calculateComfortIndex };