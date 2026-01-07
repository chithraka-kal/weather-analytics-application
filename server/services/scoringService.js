const calculateComfortIndex = (weather) => {
    let score = 100;
    
    // Temperature Penalty
    const idealTemp = 22;
    const currentTemp = weather.main.temp;
    const tempDiff = Math.abs(currentTemp - idealTemp);
    score -= (tempDiff * 2);

    // Humidity Penalty
    const idealHumidity = 50;
    const currentHumidity = weather.main.humidity;
    const humidityDiff = Math.abs(currentHumidity - idealHumidity);
    score -= (humidityDiff * 0.5);

    // Condition Penalty 
    const condition = weather.weather[0].main;
    
    if (condition === 'Rain' || condition === 'Drizzle') score -= 20;
    if (condition === 'Thunderstorm') score -= 30;
    if (condition === 'Snow') score -= 30;
    if (condition === 'Mist' || condition === 'Fog') score -= 10;

    // Boundary Checks 
    return Math.max(0, Math.min(100, Math.round(score)));
};

module.exports = { calculateComfortIndex };