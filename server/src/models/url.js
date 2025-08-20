import { Schema, model } from 'mongoose';

const urlSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    snowflakeId: { type: String, required: true, unique: true }, // Later use for distributed ID generation maybe?
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    neverExpire: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    clicks: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: null }
  },
  { collection: 'urls' }
);

// Compound index to optimize active, not expired
urlSchema.index({ isActive: 1, expiresAt: 1 });

const Url = model('Url', urlSchema);
export default Url;
