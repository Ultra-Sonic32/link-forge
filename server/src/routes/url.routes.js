import express from 'express';
import { saveShortUrlKey, redirectShortUrl } from '../controllers/url.controller.js';
import { validateFields } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/generateShortUrl', validateFields(['originalUrl']), saveShortUrlKey);
router.get('/resolve/:shortUrl', validateFields(['shortUrl']), redirectShortUrl);

export { router };
