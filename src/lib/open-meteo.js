import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.

// TODO (you): write a helper that fetches a URL and returns the parsed JSON.
//   - Pass signal: AbortSignal.timeout(config.upstreamTimeoutMs) to fetch.
//   - fetch resolves for every HTTP status, so check res.ok yourself.
//   - Turn every failure into an HttpError: 504 when the timeout fired
//     (err.name is 'TimeoutError'), 502 for a network failure, a status that
//     isn't ok, or a body that isn't JSON.
async function fetchJson(url) {
  let res;
  try {
    res = await fetch(url, {
      //pass signal
      signal: AbortSignal.timeout(config.upstreamTimeoutMs)
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new HttpError(504, 'Timeout Failure');
    }
    throw new HttpError(502, 'Network Failure');
  }

  if (!res.ok) {
    throw new HttpError(502, `Bad Status: ${res.status}`);
  }

  try {
    return await res.json();
  } catch (err) {
    throw new HttpError(502, 'Bad Body');
  }
}
// TODO (you): look up a city with the geocoding API and return
// { name, region, country, latitude, longitude, timezone } for the first result.
// Throw a 404 HttpError when there are no results.
export async function geocodeCity(name) {
  //url from assignment doc
  const url = `${config.geocodingUrl}/search?name=${name}&count=1&language=en&format=json`;
  const data = await fetchJson(url);
  //404 when no results
  if (!data.results || data.results.length === 0) {
    throw new HttpError(404, `City not found: ${name}`);
  }
  //parse first response
  const result = data.results[0];
  return {
    name: result.name,
    region: result.region,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone
  };
}

// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(latitude, longitude) {
  //not sure if parsed means I need to assign parts to different vars that get returned i guess we will see.
  const url = `${config.forecastUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3`;
  return await fetchJson(url);
}
