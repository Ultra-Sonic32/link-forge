import { connectToLinkForgeDB } from './config/dbSetup.js';
import { creatShortUrl, resolveShortUrl } from './services/url.service.js';

await connectToLinkForgeDB();

await creatShortUrl('https://www.google.com/search?q=leetscode+what+type+of+problem+is+asked+in+intervew&ie=UTF-8');
//await resolveShortUrl('msrfth4ct7mler3flvf2qrzq');
