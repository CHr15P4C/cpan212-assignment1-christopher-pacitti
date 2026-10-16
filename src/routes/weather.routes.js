import { Router } from 'express';
import { parseCity, parseCities } from '../validators/weather-query.js';
import { getCityWeather } from '../lib/weather.js';

export const weatherRouter = Router();

// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity, get the summary with getCityWeather, and respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async (req, res, next) => {
  try {
    const city = parseCity(req);
    const result = await getCityWeather(city);
    
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
        // Fix: use temperatureC instead of temperature
        const currentTemp = weatherResult.current.temperatureC;

        // Track warmest and coldest based on current temperature
        if (currentTemp > maxTemp) {
          maxTemp = currentTemp;
          warmestCity = weatherResult.location.name;
        }
        if (currentTemp < minTemp) {
          minTemp = currentTemp;
          coldestCity = weatherResult.location.name;
        }

        return {
          city: originalName,
          ok: true,
          weather: weatherResult
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