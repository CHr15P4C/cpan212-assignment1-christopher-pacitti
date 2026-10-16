import { Router } from 'express';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { getCityWeather } from '../lib/weather.js';

export const weatherRouter = Router();

// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async (req, res) => {
  try {
    const city = parseCity(req);
    const result = await getCityWeather(city);
    
    // Respond with { data, attribution }
    res.json({
      data: result,
      attribution: "Weather data by Open-Meteo.com (https://open-meteo.com/)"
    });
  } catch (err) {
    next(err);
  }
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', async (req, res, next) => {
  try {
    const cities = parseCities(req);

    // Start every lookup at once using Promise.allSettled
    const results = await Promise.allSettled(
      cities.map(async (cityName) => {
        const weatherResult = await getCityWeather(cityName);
        return { cityName, weatherResult };
      })
    );

    let succeeded = 0;
    let failed = 0;
    let warmestCity = null;
    let coldestCity = null;
    let maxTemp = -Infinity;
    let minTemp = Infinity;

    const citiesOutput = results.map((settledResult, index) => {
      const originalName = cities[index];
      if (settledResult.status === 'fulfilled') {
        succeeded++;
        const { weatherResult } = settledResult.value;
        const currentTemp = weatherResult.current.temperature;

        // Track warmest and coldest based on current temperature
        if (currentTemp > maxTemp) {
          maxTemp = currentTemp;
          warmestCity = weatherResult.city.name;
        }
        if (currentTemp < minTemp) {
          minTemp = currentTemp;
          coldestCity = weatherResult.city.name;
        }

        return {
          city: originalName,
          ok: true,
          weather: {
            location: weatherResult.city,
            current: {
              time: weatherResult.current.time || new Date().toISOString().slice(0, 16),
              temperatureC: weatherResult.current.temperature,
              feelsLikeC: weatherResult.current.apparentTemperature,
              humidityPercent: weatherResult.current.humidity,
              windKmh: weatherResult.current.windSpeed,
              weatherCode: weatherResult.current.weatherCode || 0,
              conditions: weatherResult.current.condition,
            },
            daily: weatherResult.forecast.map(day => ({
              date: day.date,
              minC: day.minTemp,
              maxC: day.maxTemp,
              precipitationChancePercent: day.precipitationProbability,
              weatherCode: day.weatherCode || 0,
              conditions: day.condition,
            })),
            fetchedAt: new Date().toISOString(),
            cached: weatherResult.cached,
          }
        };
      } else {
        failed++;
        const err = settledResult.reason;
        return {
          city: originalName,
          ok: false,
          error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error'
          }
        };
      }
    });

    const summary = {
      succeeded,
      failed,
      ...(succeeded > 0 ? { warmest: warmestCity, coldest: coldestCity } : {})
    };

    res.json({
      data: {
        cities: citiesOutput,
        summary
      },
      attribution: "Weather data by Open-Meteo.com (https://open-meteo.com/)"
    });
  } catch (err) {
    next(err);
  }
});
