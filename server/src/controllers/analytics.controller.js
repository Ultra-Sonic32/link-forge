import {
  fetchDashboardStats,
  fetchRecentAccessLogs,
  logAnalytics,
  fetchClicksOverTime,
  fetchTopUrls
} from '../services/analytics.service.js';

const getDashboardCards = async (req, res) => {
  try {
    const stats = await fetchDashboardStats();
    res.status(200).json(stats);
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

const getRecentAnalyticsTable = async (req, res) => {
  try {
    const logs = await fetchRecentAccessLogs();
    res.status(200).json(logs);
  } catch (err) {
    console.error('Recent access logs error:', err);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
};

// const postAnalyticsData = async (req, res) => {
//   const { shortUrl, ip, referrer, userAgent, country } = req.body;
//   try {
//     await logAnalytics(shortUrl, ip, referrer, userAgent, country);
//     res.status(204).end();
//   } catch (err) {
//     console.error('Access logging failed:', err);
//     res.status(500).json({ message: 'Failed to log access' });
//   }
// };

const getClicksChartData = async (req, res) => {
  try {
    const data = await fetchClicksOverTime();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error getting chart data' });
  }
};

const getTopClickedUrls = async (req, res) => {
  try {
    const data = await fetchTopUrls();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error getting top URLs' });
  }
};

export { getDashboardCards, getRecentAnalyticsTable, postAnalyticsData, getClicksChartData, getTopClickedUrls };
