import { createId } from '@paralleldrive/cuid2';
import FlakeId from 'flake-idgen';

const flake = new FlakeId({ epoch: 1577836800000, worker: 1, pid: 1 });

const generateSnowflakeId = () => {
  const buffer = flake.next(); // returns Buffer
  return BigInt('0x' + buffer.toString('hex')).toString();
};

//? Maybe slice the id to lenght 8 may cause collition then, will later alos allow user aliases and not just the generate key
const generateShortUrlKey = () => {
  return createId();
};

export { generateSnowflakeId, generateShortUrlKey };
