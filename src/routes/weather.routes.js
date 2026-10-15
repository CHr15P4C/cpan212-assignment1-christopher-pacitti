import { Router } from 'express';
import { parseCity } from '../validators/weather-query';

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
weatherRouter.get('/compare', (req, res) => {
  res.status(501).json({ error: { message: 'Not written yet: GET /api/compare' } });
});
