import Url from '../models/url.js';

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

//TODO Add Logic in here to return all record with maybe extrat parms to filter like is active or by some date
const findAllShortUrl = async () => {};

export { saveUrl, findByShortUrl, findBySnowID, isShortKeyTaken, findByOriginalUrl, incrementClicks };
