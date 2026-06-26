import app from '../src/app';
import mongoose from 'mongoose';
import config from '../src/config';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await mongoose.connect(config.database_url as string, {
        serverApi: { version: '1', strict: true, deprecationErrors: true },
        serverSelectionTimeoutMS: 30000,
        retryWrites: true,
      });
      isConnected = true;
    } catch (error) {
      console.error('Vercel handler database connection failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed.',
      });
    }
  }
  return app(req, res);
}
