import { connectToLinkForgeDB } from './config/dbSetup.js';
import { generateSnowflakeId, generateShortUrlKey } from './utilities/keyGenerator.js';
import { creatShortUrl } from './services/url.service.js';

await connectToLinkForgeDB();
let id = generateShortUrlKey();
console.log(`Generated SHort ID: ${id}`);

let ids = JSON.stringify(generateSnowflakeId());
console.log(`Generated snow ID: ${ids}`);

await creatShortUrl('https://www.google.com/search?q=leetscode+what+type+of+problem+is+asked+in+intervew&ie=UTF-8');
