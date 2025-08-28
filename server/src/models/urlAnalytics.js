import { Schema, model } from 'mongoose';
//?for later use

const urlAnalyticSchema = new Schema(
  {
    shortUrl: { type: String, required: true },
    accessedAt: { type: Date, default: Date.now },
    ip: { type: String, required: true }, // Just give back ipv6 for local host ::1 will work if hsted or using reverseproxy
    referrer: { type: String, default: null },
    country: { type: String, default: null }, // will only work with correct ip
    browser: { type: String, default: null },
    os: { type: String, default: null },
    device: { type: String, default: null }
  },
  { collection: 'urlAnalytics' }
);

urlAnalyticSchema.index({ shortUrl: 1, accessedAt: -1 });
const UrlAnalytics = model('UrlAnalytics', urlAnalyticSchema);
export default UrlAnalytics;
