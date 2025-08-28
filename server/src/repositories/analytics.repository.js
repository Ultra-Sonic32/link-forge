import Url from '../models/url.js';
import UrlAnalytics from '../models/urlAnalytics.js';

/**
 * Save the analytics of a short url
 * @param {*} log
 * @returns
 */
const saveAnalyticsLog = async log => {
  const entry = new UrlAnalytics(log);
  return await entry.save();
};

/**
 * Get specific stats detail that will be used on frontedn for top level stats cards
 * @returns
 */
const getDashboardStats = async () => {
  const [totalUrls, totalClicks, mostClicked, mostRecent] = await Promise.all([
    Url.countDocuments(),
    Url.aggregate([{ $group: { _id: null, total: { $sum: '$clicks' } } }]),
    Url.findOne().sort({ clicks: -1 }).limit(1),
    Url.findOne().sort({ createdAt: -1 }).limit(1)
  ]);
  return {
    totalUrls,
    totalClicks: totalClicks[0]?.total || 0,
    mostClicked: mostClicked || null,
    mostRecent: mostRecent || null
  };
};

/**
 * Get the recently accessed shorturls with their stats for use in frontend table
 * @param {number} limit
 * @returns
 */
const getRecentAccessLogs = async (limit = 25) => {
  return UrlAnalytics.find().sort({ accessedAt: -1 }).limit(limit).lean();
};

/**
 * Find the shortUrl that is used the most based on the click count of the shortUrl
 * @param {number} limit
 * @returns
 */
const getTopUrlsByClicks = async limit => {
  return Url.find().sort({ clicks: -1 }).limit(limit).lean();
};

/**
 * groups logs by accessedAT with data and returns something like this array f this   { _id: "2025-08-15", count: 123 },
 * @returns
 */
const getClicksOverTime = async () => {
  return UrlAnalytics.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$accessedAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

export { getDashboardStats, getRecentAccessLogs, saveAnalyticsLog, getTopUrlsByClicks, getClicksOverTime };
