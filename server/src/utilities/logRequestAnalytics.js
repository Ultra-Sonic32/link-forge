import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';
import { logAnalytics } from '../services/analytics.service.js';

const logRequestAnalytics = async (shortUrl, req) => {
  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      req.ip ||
      'unknown';
    const userAgentStr = req.headers['user-agent'] || 'Unknown';
    const referrer = req.headers['referer'] || 'Unknown';
    const country = geoip.lookup(ip)?.country || 'Unknown';

    const parser = new UAParser();
    const uaResult = parser.setUA(userAgentStr).getResult();

    const browser = uaResult.browser.name || 'Unknown';
    const os = uaResult.os.name || 'Unknown';
    const device = uaResult.device.type || 'Desktop';

    await logAnalytics({ shortUrl, ip, referrer, userAgent: userAgentStr, country, browser, os, device });
  } catch (err) {
    console.warn('Analytics logging failed:', err);
  }
};

export default logRequestAnalytics;
