import { HttpError } from '../lib/http-error.js';

// TODO (you): check ?city= and return the trimmed city name. Throw a 400
// HttpError with details.city when it breaks a rule from the assignment page.
export function parseCity(req) {
  const city = req.query.city;
  if (!city || typeof city !== 'string' || !city.trim()) {
    throw new HttpError(400, 'Missing or invalid "city" query parameter');
  }
  return city.trim();
}

// TODO (you): check ?cities= and return an array of trimmed city names. Throw a
// 400 HttpError with details.cities when it breaks a rule from the assignment page.
export function parseCities(value) {
  const citiesParam = req.query.cities;
  if (!citiesParam || typeof citiesParam !== 'string') {
    throw new HttpError(400, 'Missing or invalid "cities" query parameter');
  }
  const cities = citiesParam
    .split(',')
    .map(c => c.trim())
    .filter(Boolean);

  if (cities.length === 0) {
    throw new HttpError(400, 'At least one city must be provided for comparison');
  }
  return cities;
}
