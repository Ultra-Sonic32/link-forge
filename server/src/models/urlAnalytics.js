import {Schema, model  } from 'mongoose';

const urlAnalyticSchema = new Schema({
    shortUrl: { type: String, required: true, unique: true },
    accessedAt: { type: Date, default: Date.now },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    referrer: { type: String, default: null },
    country: { type: String, default: null },
},
{collection: 'urlAnalytics'});

const UrlAnalytics = model('UrlAnalytics', urlAnalyticSchema);
export default UrlAnalytics;
