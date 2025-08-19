import {connectToLinkForgeDB} from './config/dbSetup.js';
import { generateSnowflakeId, generateShortUrlKey } from './utilities/keyGenerator.js';

await connectToLinkForgeDB();
let id = generateShortUrlKey();
console.log(`Generated SHort ID: ${id}`);

let ids = JSON.stringify(generateSnowflakeId());
console.log(`Generated snow ID: ${ids}`);