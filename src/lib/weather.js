import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';
import { getCache, setCache } from './cache.js';

export async function getCityWeather(city) {
  const cacheKey = city.trim().toLowerCase();
  
  // Check cache first
  const cachedEntry = getCache(cacheKey);
  if (cachedEntry) {
    return {
      ...cachedEntry,
      cached: true, // cached responses report cached: true
    };
  }

  // On a miss: capture fetchedAt at the exact time Open-Meteo is called
  const fetchedAt = new Date().toISOString();

  const locationData = await geocodeCity(city);
  const forecastData = await getForecast(locationData.latitude, locationData.longitude);

  const summary = {
    location: {
      name: locationData.name,
      region: locationData.region,
      country: locationData.country,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timezone: locationData.timezone,
    },
    current: {
      time: forecastData.current.time,
      temperatureC: forecastData.current.temperature_2m,
      feelsLikeC: forecastData.current.apparent_temperature,
      humidityPercent: forecastData.current.relative_humidity_2m,
      windKmh: forecastData.current.wind_speed_10m,
      weatherCode: forecastData.current.weather_code,
      conditions: describeWeatherCode(forecastData.current.weather_code),
    },
    daily: forecastData.daily.time.map((date, index) => ({
      date,
      minC: forecastData.daily.temperature_2m_min[index],
      maxC: forecastData.daily.temperature_2m_max[index],
      precipitationChancePercent: forecastData.daily.precipitation_probability_max?.[index] ?? null,
      weatherCode: forecastData.daily.weather_code[index],
      conditions: describeWeatherCode(forecastData.daily.weather_code[index]),
    })),
    fetchedAt,
  };

  // Save the summary into the cache
  setCache(cacheKey, summary);

  return {
    ...summary,
    cached: false, // fresh responses report cached: false
  };
}