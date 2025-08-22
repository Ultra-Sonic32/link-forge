import {
  saveUrl,
  findByShortUrl,
  findBySnowID,
  isShortKeyTaken,
  findByOriginalUrl,
  incrementClicks,
  findAllShortUrl
} from '../repositories/url.repository.js';
import validator from 'validator';
import { generateShortUrlKey, generateSnowflakeId } from '../utilities/keyGenerator.js';
import { get, set, redisExpirationMode, extendTTL } from '../config/redisSetup.js';

const creatShortUrl = async (originalUrl, customKey = null, neverExpire = false) => {
  const EXPIRY_DAYS = 30;

  if (!validator.isURL(originalUrl)) {
    throw new Error('Invalid url provided');
  }

  const savedUrl = await findByOriginalUrl(originalUrl);
  console.log(`Found existing URL: ${savedUrl ? savedUrl.shortUrl : 'none'}`);
  if (savedUrl) {
    return savedUrl.shortUrl;
  }

  if (customKey && (await isShortKeyTaken(customKey))) {
    throw new Error('Custom short key already in use');
  }

  let shortUrl = customKey || generateShortUrlKey();
  let snowflakeId;
  let attempt = 0;
  while (true) {
    snowflakeId = generateSnowflakeId();
    const exists = await findBySnowID(snowflakeId);
    if (!exists) break;
    if (++attempt > 5) throw new Error('Failed to generate unique ID');
  }

  const expiresAt = !neverExpire ? new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000) : null;

  const savedResult = await saveUrl({ originalUrl: originalUrl, shortUrl, snowflakeId, expiresAt, neverExpire });
  await set(shortUrl, originalUrl, redisExpirationMode.EX, 60 * 60);

  return savedResult;
};

const resolveShortUrl = async shortUrl => {
  const cachedKey = await get(shortUrl);
  if (cachedKey) {
    //console.log('Cache triggered');
    // Extend TTL
    await extendTTL(shortenUrlKey, 60);
    return cachedKey;
  }

  const urlDoc = await findByShortUrl(shortUrl);
  if (!urlDoc) {
    throw new Error('Short URL not found');
  }

  if (!urlDoc.isActive) throw new Error('Short URL is deactivated');

  if (!urlDoc.neverExpire && urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
    throw new Error('Short URL has expired');
  }
  await incrementClicks(shortUrl);
  await set(shortUrl, urlDoc.originalUrl, redisExpirationMode.EX, 120);
  //console.log(`Accessed URL: ${urlDoc.originalUrl}`);
  return urlDoc.originalUrl;
};

const getAllUrls = async filters => {
  return await findAllShortUrl(filters);
};

export { creatShortUrl, resolveShortUrl, getAllUrls };
