import express from 'express';
import { uploadMiddleware, uploadFile, shareFile, getBucketData } from '../controllers/fileController';

const router = express.Router();

// Route for uploading files
router.post('/upload', uploadMiddleware, uploadFile);

// Route for sharing files
router.post('/share-file', async (req, res, next) => {
  try {
    await shareFile(req, res); // Call shareFile with only req and res
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

router.get('/bucket-data', getBucketData);


export default router;
