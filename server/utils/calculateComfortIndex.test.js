const { calculateComfortIndex } = require('../utils/calculateComfortIndex'); 

describe('Comfort Index Calculation', () => {

    test('should return 100 for perfect conditions (24°C, 50%, 3m/s)', () => {
        const perfectWeather = {
            main: { temp: 24, humidity: 50 },
            wind: { speed: 3 }
        };
        expect(calculateComfortIndex(perfectWeather)).toBe(100);
    });

    test('should deduct points correctly for temperature deviation', () => {
        // 10° deviation * 2.0 weight = 20 point penalty
        const hotWeather = {
            main: { temp: 34, humidity: 50 },
            wind: { speed: 3 }
        };
        expect(calculateComfortIndex(hotWeather)).toBe(80);
    });

    test('should deduct points correctly for humidity deviation', () => {
        // 20% deviation * 0.5 weight = 10 point penalty
        const humidWeather = {
            main: { temp: 24, humidity: 70 },
            wind: { speed: 3 }
        };
        expect(calculateComfortIndex(humidWeather)).toBe(90);
    });

    test('should deduct points correctly for wind deviation', () => {
        // 10m/s deviation * 0.2 weight = 2 point penalty
        const windyWeather = {
            main: { temp: 24, humidity: 50 },
            wind: { speed: 13 }
        };
        expect(calculateComfortIndex(windyWeather)).toBe(98);
    });

    test('should clamp the score to 0 for extreme bad weather', () => {
        const disasterWeather = {
            main: { temp: 100, humidity: 100 }, 
            wind: { speed: 100 }
        };
        expect(calculateComfortIndex(disasterWeather)).toBe(0);
    });

    test('throws an error if weather data is missing structure', () => {
        // Function expects specific object structure; ensure it fails loudly on invalid input
        const badData = {}; 
        expect(() => {
            calculateComfortIndex(badData);
        }).toThrow();
    });
});