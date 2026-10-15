import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';
import { getCache, setCache, getCacheStats } from './cache.js';

// Attribution text for the end of the output JSON
const ATTRIBUTION_TEXT = "Weather data by Open-Meteo.com (https://open-meteo.com/)";

// Return the weather summary for one city, checking the cache first.
export async function getCityWeather(city) {
  const cacheKey = city.trim().toLowerCase();
  
  // Check cache first
  const cachedSummary = getCache(cacheKey);
  if (cachedSummary) {
    return {
      ...cachedSummary,
      cached: true,
    };
  }

  // On a miss: geocode city and get forecast
  const location = await geocodeCity(city);
  const forecastData = await getForecast(location.latitude, location.longitude);

  // Build the weather summary
  const summary = {
    city: {
      name: location.name,
      region: location.region,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone,
    },
    current: {
      temperature: forecastData.current.temperature_2m,
      apparentTemperature: forecastData.current.apparent_temperature,
      humidity: forecastData.current.relative_humidity_2m,
      windSpeed: forecastData.current.wind_speed_10m,
      condition: describeWeatherCode(forecastData.current.weather_code),
    },
    forecast: forecastData.daily.time.map((date, index) => ({
      date,
      maxTemp: forecastData.daily.temperature_2m_max[index],
      minTemp: forecastData.daily.temperature_2m_min[index],
      precipitationProbability: forecastData.daily.precipitation_probability_max[index],
      condition: describeWeatherCode(forecastData.daily.weather_code[index]),
    })),
    attribution: ATTRIBUTION_TEXT,
  };

  // Store in cache
  setCache(cacheKey, summary);

  return {
    ...summary,
    cached: false,
  };
}

// Re-export cache stats for route handlers
export { getCacheStats };