import express from 'express';
import { getDashboardCards, getRecentAnalyticsTable, getClicksChartData, getTopClickedUrls } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/dashboardStats', getDashboardCards);
router.get('/recentAccessLogs', getRecentAnalyticsTable);
router.get('/clickOverTime', getClicksChartData);
router.get('/topShortUrl', getTopClickedUrls);

export { router };
