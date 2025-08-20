import {
  saveUrl,
  findByShortUrl,
  findBySnowID,
  isShortKeyTaken,
  findByOriginalUrl,
  incrementClicks
} from '../repositories/url.repository.js';
import validator from 'validator';
import { generateShortUrlKey, generateSnowflakeId } from '../utilities/keyGenerator.js';

const creatShortUrl = async (originalUrl, customKey = null, neverExpire = false) => {
  const EXPIRY_DAYS = 30;

  if (!validator.isURL(originalUrl)) {
    throw new Error('Invalid url provided');
  }

  const savedUrl = await findByOriginalUrl(originalUrl);
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

  return await saveUrl({
    originalUrl: originalUrl,
    shortUrl,
    snowflakeId,
    expiresAt,
    neverExpire
  });
};

export { creatShortUrl };
