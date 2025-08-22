import Url from '../models/url.js';

const PUBLIC_FIELDS = 'shortUrl originalUrl isActive createdAt expiresAt neverExpire lastAccessed clicks';

/**
 * Save Url Data to the database
 * @param {*} data
 * @returns
 */
const saveUrl = async data => {
  const url = new Url(data);
  return await url.save();
};

/**
 * Find specific record by shortUrl
 * @param {string} shortUrl
 * @returns
 */
const findByShortUrl = async shortUrl => {
  return Url.findOne({ shortUrl, isActive: true });
};

/**
 * Find specific record by snowflake ID
 * @param {string} snowflakeId
 * @returns
 */
const findBySnowID = async snowflakeId => {
  return Url.findOne({ snowflakeId });
};

/**
 * Find specific record by orginal Url
 * @param {string} originalUrl
 * @returns
 */
const findByOriginalUrl = async originalUrl => {
  return Url.findOne({ originalUrl });
};

/**
 * Check if shortKey exist return true or false
 * @param {string} shortUrl
 * @returns
 */
const isShortKeyTaken = async shortUrl => {
  const existing = await Url.findOne({ shortUrl });
  return existing ? true : false;
};

/**
 * Increment the clicks field for each shortend url
 * @param {string} shortUrl
 * @returns
 */
const incrementClicks = async shortUrl => {
  return await Url.findOneAndUpdate(
    { shortUrl },
    {
      $inc: { clicks: 1 },
      $set: { lastAccessed: new Date() }
    },
    { new: true }
  );
};

/**
 * Find All url in database and optional provide queryparm filters
 * @param {*} filter
 */
const findAllShortUrl = async (filters = {}) => {
  const query = {};

  if (filters.isActive !== undefined) query.isActive = filters.isActive;
  if (filters.neverExpire !== undefined) query.neverExpire = filters.neverExpire;

  if (filters.createdFrom || filters.createdTo) {
    query.createdAt = {};
    if (filters.createdFrom) query.createdAt.$gte = new Date(filters.createdFrom); // greater than or equals
    if (filters.createdTo) query.createdAt.$lte = new Date(filters.createdTo); // less tahn or equals
  }

  // Exact match used for performance. Regex impacts latency, and `contains` is only needed for partial matching.
  if (filters.originalUrl) query.originalUrl = filters.originalUrl;
  if (filters.shortUrl) query.shortUrl = filters.shortUrl;

  return Url.find(query, PUBLIC_FIELDS);
};

export { saveUrl, findByShortUrl, findBySnowID, isShortKeyTaken, findByOriginalUrl, incrementClicks, findAllShortUrl };
