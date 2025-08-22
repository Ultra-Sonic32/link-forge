export interface urlDetails {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  snowflakeId?: string;
  expiresAt: string;
  neverExpire: boolean;
  isActive: boolean;
  clicks: number;
  lastAccessed: string | null;
  createdAt: string;
}

export interface createUrl {
  originalUrl: string;
  customKey?: string;
  neverExpire: boolean;
}

export interface resolveShortUrl {
  originalUrl: string;
}
