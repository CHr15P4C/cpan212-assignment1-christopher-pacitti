// TODO (you): an in-memory cache where each entry expires after a set time.
// It needs a way to get a value (counting a hit or a miss), store a value,
// and report { entries, hits, misses, ttlSeconds }. The exact counting rules
// are on the assignment page. A Map with { value, expiresAt } entries works well.
import { config } from '../config.js';
//setting up the cache
const cache = new Map();
let hits = 0;
let misses = 0;
const ttlMs = config.cacheTtlSeconds * 1000;
//function to kill expired cache entries so theres no memory leak
function purgeExpired() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  }
}
//getcache key for use in weather.js
export function getCache(key) {
  purgeExpired();
  const entry = cache.get(key);
  if (!entry) {
    misses++;
    return null;
  }
  hits++;
  return entry.value;
}
//set cache 
export function setCache(key, value) {
  purgeExpired();
  const expiresAt = Date.now() + ttlMs;
  cache.set(key, { value, expiresAt });
}
//return cache stats for cache routes
export function getCacheStats() {
  purgeExpired();
  return {
    entries: cache.size,
    hits,
    misses,
    ttlSeconds: config.cacheTtlSeconds,
  };
}