import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taskpal',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development'
}; 