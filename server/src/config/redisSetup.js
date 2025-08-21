import { Redis } from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_DOCKER_PORT = process.env.REDIS_DOCKER_PORT;

const redisExpirationMode = Object.freeze({
  EX: 'EX'
});

let client = null;

//Get redis client
const getRedisClient = () => {
  if (!client) {
    const config = {
      host: REDIS_HOST,
      port: Number(REDIS_DOCKER_PORT),
      maxRetriesPerRequest: null
    };
    client = new Redis(config);
  }
  return client;
};

// Redis connect
const connectToRedis = async () => {
  const client = getRedisClient();
  client
    .on('connect', () => {
      console.log('Successfully connect to redis client');
    })
    .on('error', error => {
      console.error('Error on redis:', error.message);
    });
};

//create a key value pair
const set = async (key, value, expirationMode, seconds) => {
  try {
    await getRedisClient().set(key, value, expirationMode, seconds);
    console.info(`Key ${key} created in redis `);
  } catch (error) {
    console.error(`Failed to create key in redis: ${error}`);
  }
};

//get value in cache
const get = async key => {
  try {
    const value = await getRedisClient().get(key);
    console.info(`Value with key ${key} fetched from redis`);
    return value;
  } catch (error) {
    console.error(`Failed to retrive key ${key} in redis: ${error}`);
    return null;
  }
};

const extendTTL = async (key, additionalTimeInSeconds) => {
  try {
    const currentTTL = await getRedisClient().ttl(key);

    if (currentTTL > 0) {
      const newTTL = currentTTL + additionalTimeInSeconds;
      await getRedisClient().expire(key, newTTL);
      console.info(`TTL for key ${key} extended to ${newTTL} in redis`);
    } else {
      console.error(`Failed to extend TTL of key ${key} in redis`);
    }
  } catch (error) {
    console.error(`Error while extending TTL: ${error}`);
  }
};

export { redisExpirationMode, connectToRedis, set, get, extendTTL };
