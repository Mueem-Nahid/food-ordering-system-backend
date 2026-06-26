import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8080,
  database_url: required('DATABASE_URL'),
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  jwt: {
    jwt_secret: required('JWT_SECRET'),
    jwt_refresh_secret: required('JWT_REFRESH_SECRET'),
    jwt_expired_time: process.env.JWT_EXPIRED_TIME || '1d',
    jwt_refresh_token_expired_time:
      process.env.JWT_REFRESH_TOKEN_EXPIRED_TIME || '2d',
  },
  frontend_url: process.env.FRONTEND_URL,
  google_client_id: required('GOOGLE_CLIENT_ID'),
};
