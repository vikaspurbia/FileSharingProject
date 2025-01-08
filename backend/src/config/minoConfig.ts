import { Client } from 'minio';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL); 

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT as string,
  port: parseInt(process.env.MINIO_PORT as string, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY as string,
  secretKey: process.env.MINIO_SECRET_KEY as string,
});
