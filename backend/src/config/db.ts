import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// DATABASE_URL
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const connectDB = async () => {
  try {
    const dbURI = process.env.DATABASE_URL as string;

    if (!dbURI) {
      throw new Error('DATABASE_URL is not defined in the environment variables.');
    }

    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB 
    await mongoose.connect(dbURI, {} as any);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      console.error(error.stack); // Print stack trace for more info
    }
    process.exit(1);
  }
};

export default connectDB;
