import dotenv from 'dotenv';
import { connect } from 'mongoose';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectToLinkForgeDB = async () => {
  try {
    await connect(MONGO_URI);
    console.log('Successfully connect to DB');
  } catch (error) {
    console.error('Error connecting to DB:', error);
    throw error;
  }
};

export { connectToLinkForgeDB };
