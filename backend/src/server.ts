import cron from 'node-cron';
import { File } from './models/file.model';
import { minioClient } from './config/minoConfig';
import express, { Request, Response, NextFunction } from 'express';
import connectDB from './config/db'; 
import fileRoutes from './routes/fileRoutes';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

// Cron job to delete expired files
cron.schedule('0 0 * * *', async () => {  // Runs daily at midnight
  const expiredFiles = await File.find({ expirationDate: { $lt: new Date() } });

  for (const file of expiredFiles) {
    try {
      // Delete the file from Minio
      await minioClient.removeObject('my-bucket', file.fileName);

      // Delete the file record from the database
      await File.deleteOne({ _id: file._id });
      console.log(`Expired file deleted: ${file.fileName}`);
    } catch (err) {
      console.error(`Error deleting expired file: ${file.fileName}`, err);
    }
  }
});



const app = express();

// Connect to the database
connectDB();

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // matches the frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', err);
  res.status(500).send('Something went wrong!');
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request made to: ${req.url}`);
  next();
});

// API routes
app.use('/api/users', userRoutes); 
app.use('/api/files', fileRoutes);

// Define port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
