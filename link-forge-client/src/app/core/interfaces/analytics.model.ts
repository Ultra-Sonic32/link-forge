import { urlDetails } from './url-details.model';

export interface analytics {
  _id: string;
  shortUrl: string;
  ip: string;
  userAgent: string;
  referrer: string;
  country: string;
  browser: string;
  os: string;
  device: string;
  accessedAt: string;
}

export interface analyticsDashboardStats {
  totalUrls: number;
  totalClicks: number;
  mostClicked: urlDetails;
  mostRecent: urlDetails;
}

export interface clicksOverTime {
  _id: string; // formt: 'YYYY-MM-DD'
  count: number;
}
