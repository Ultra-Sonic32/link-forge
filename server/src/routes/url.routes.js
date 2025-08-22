import express from 'express';
import { saveShortUrlKey, redirectShortUrl, getAllShortUrls } from '../controllers/url.controller.js';
import { validateFields } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/generateShortUrl', validateFields(['originalUrl']), saveShortUrlKey);
router.get('/resolve/:shortUrl', validateFields(['shortUrl']), redirectShortUrl);
router.get('/all', getAllShortUrls);

export { router };
