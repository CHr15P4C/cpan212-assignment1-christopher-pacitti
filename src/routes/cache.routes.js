import { Router } from 'express';
import { getCacheStats } from './weather.js';
export const cacheRouter = Router();

// TODO (you): respond with { data: <the cache statistics> }.
// Respond with { data: <the cache statistics> }
cacheRouter.get('/cache/stats', (req, res) => {
  const stats = getCacheStats();
  res.json({ data: stats });
});