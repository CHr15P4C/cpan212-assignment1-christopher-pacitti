import { HttpError } from '../lib/http-error.js';

// Check ?city= and return the trimmed city name. Throws a 400 HttpError with details.city when it breaks the 2 to 60 characters rule.
export function parseCity(req) {
  const city = req.query.city;
  if (!city || typeof city !== 'string' || city.trim().length < 2 || city.trim().length > 60) {
    throw new HttpError(400, 'Invalid query', { city: 'city must be 2 to 60 characters' });
  }
  return city.trim();
}

// Check ?cities= and return an array of trimmed city names. Throws a 400 HttpError with details.cities when validation fails or duplicates exist.
export function parseCities(req) {
  const citiesParam = req.query.cities;
  if (!citiesParam || typeof citiesParam !== 'string') {
    throw new HttpError(400, 'Invalid query', { cities: 'Missing or invalid "cities" query parameter' });
  }
  
  const rawCities = citiesParam
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  if (rawCities.length === 0) {
    throw new HttpError(400, 'Invalid query', { cities: 'At least one city must be provided for comparison' });
  }

  const seen = new Set();
  for (const c of rawCities) {
    const lower = c.toLowerCase();
    if (seen.has(lower)) {
      throw new HttpError(400, 'Invalid query', { cities: `"${c}" is listed more than once` });
    }
    seen.add(lower);
  }

  return rawCities;
}