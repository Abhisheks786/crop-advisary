let redisClient = null;
let redisAvailable = false;
let loggedError = false;

const initRedis = async () => {
  if (process.env.DEMO_MODE === 'true' && !process.env.FORCE_REDIS) {
    // In demo mode, skip Redis connection unless explicitly requested
    return;
  }
  try {
    const { createClient } = require('redis');
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 1) {
            return new Error('Redis connection failed, giving up');
          }
          return 500;
        }
      }
    });
    redisClient.on('error', (err) => {
      if (!loggedError) {
        console.warn('⚠️  Redis unavailable, caching disabled (falling back to memory):', err.message);
        loggedError = true;
      }
      redisAvailable = false;
    });
    redisClient.on('connect', () => {
      console.log('✅ Redis Connected');
      redisAvailable = true;
    });
    await redisClient.connect();
  } catch (error) {
    if (!loggedError) {
      console.warn('⚠️  Redis unavailable, caching disabled:', error.message);
      loggedError = true;
    }
    redisAvailable = false;
  }
};

const getCache = async (key) => {
  if (!redisAvailable || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

const setCache = async (key, value, expSeconds = 3600) => {
  if (!redisAvailable || !redisClient) return;
  try {
    await redisClient.setEx(key, expSeconds, JSON.stringify(value));
  } catch { /* ignore */ }
};

const invalidateCache = async (pattern) => {
  if (!redisAvailable || !redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) await redisClient.del(keys);
  } catch { /* ignore */ }
};

module.exports = { initRedis, getCache, setCache, invalidateCache, getRedisStatus: () => redisAvailable };
