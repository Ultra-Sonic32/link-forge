import {
  getDashboardStats,
  getRecentAccessLogs,
  saveAnalyticsLog,
  getTopUrlsByClicks,
  getClicksOverTime
} from '../repositories/analytics.repository.js';

const logAnalytics = async (shortUrl, ip, country, referrer, browser, os, device) => {
  return await saveAnalyticsLog({ shortUrl, ip, country, referrer, browser, os, device });
};

const fetchDashboardStats = async () => {
  return await getDashboardStats();
};

const fetchRecentAccessLogs = async () => {
  return await getRecentAccessLogs();
};

const fetchClicksOverTime = async () => {
  return await getClicksOverTime();
};

const fetchTopUrls = async limit => {
  return await getTopUrlsByClicks(limit || 5);
};

export { fetchDashboardStats, fetchRecentAccessLogs, logAnalytics, fetchClicksOverTime, fetchTopUrls };
