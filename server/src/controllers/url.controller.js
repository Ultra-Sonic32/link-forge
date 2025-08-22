import { creatShortUrl, resolveShortUrl, getAllUrls } from '../services/url.service.js';

const saveShortUrlKey = async (req, res) => {
  const { originalUrl, customKey, neverExpire } = req.body;
  try {
    const response = await creatShortUrl(originalUrl, customKey, neverExpire);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error creating short url key', error);
    res.status(500).json({ message: error.message || 'Error saving short url ' });
  }
};

const redirectShortUrl = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const response = await resolveShortUrl(shortUrl);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error resolving short url', error);
    res.status(500).json({ message: error.message || 'Error resolving short url' });
  }
};

const getAllShortUrls = async (req, res) => {
  const filters = req.query;
  try {
    const response = await getAllUrls(filters);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching urls:', error);
    res.status(500).json({ message: error.message || 'Error getting urls' });
  }
};

export { saveShortUrlKey, redirectShortUrl, getAllShortUrls };
