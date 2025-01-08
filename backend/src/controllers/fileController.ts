
// import { Request, Response } from 'express';
// import { minioClient } from '../config/minoConfig';
// import { User } from '../models/user.model';
// import nodemailer from 'nodemailer';
// import { Readable } from 'stream';
// import multer from 'multer';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
// });

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Helper function to check if a file exists in MinIO
// const checkFileExists = async (bucket: string, key: string): Promise<boolean> => {
//   try {
//     await minioClient.statObject(bucket, key);
//     return true;
//   } catch (err) {
//     if ((err as any).code === 'NoSuchKey') {
//       return false;
//     }
//     throw err;
//   }
// };

// // Middleware for handling file upload route
// export const uploadMiddleware = upload.single('file');

// export const uploadFile = async (req: Request, res: Response): Promise<void> => {
//   const bucketName = 'my-bucket';
//   const file = req.file;

//   if (!file) {
//     res.status(400).send({ error: 'No file uploaded.' });
//     return; // Ensure no further code execution
//   }

//   try {
//     // Ensure the bucket exists
//     const bucketExists = await minioClient.bucketExists(bucketName);
//     if (!bucketExists) {
//       await minioClient.makeBucket(bucketName, '');
//       console.log(`Bucket ${bucketName} created.`);
//     }

//     // Upload file to MinIO
//     await minioClient.putObject(bucketName, file.originalname, file.buffer, file.buffer.length, {
//       'Content-Type': file.mimetype,
//     });

//     console.log(`File ${file.originalname} uploaded to ${bucketName}`);

//     res.status(200).send({
//       message: 'File uploaded successfully.',
//       fileName: file.originalname,
//     });
//   } catch (err) {
//     console.error('Error during file upload:', err);
//     res.status(500).send({ error: 'Failed to upload the file.', details: err });
//   }
// };


// // Convert stream to buffer
// const streamToBuffer = (stream: Readable): Promise<Buffer> => {
//   return new Promise((resolve, reject) => {
//     const chunks: Buffer[] = [];
//     stream.on('data', chunk => chunks.push(chunk));
//     stream.on('end', () => resolve(Buffer.concat(chunks)));
//     stream.on('error', reject);
//   });
// };

// // Share File Handler
// export const shareFile = async (req: Request, res: Response): Promise<void> => {
//   const { fileName, shareType, emails, role } = req.body;

//   if (!fileName || !shareType || (!emails && !role)) {
//     res.status(400).send({ error: 'Missing required fields.' });
//     return; // Ensure no further code execution
//   }

//   try {
//     console.log('Received request to share file:', { fileName, shareType, emails, role });

//     // Check if the file exists before sharing
//     const fileExists = await checkFileExists('my-bucket', fileName);
//     if (!fileExists) {
//       res.status(404).send({ error: 'File not found.' });
//       return; // Ensure no further code execution
//     }

//     // Fetch users to share with
//     let users;
//     if (shareType === 'individually' || shareType === 'multi-user') {
//       users = await User.find({ email: { $in: emails } });
//       console.log('Users fetched individually or multi-user:', users);
//       if (!users.length) {
//         res.status(404).send({ error: 'No users found for the specified criteria.' });
//         return; // Ensure no further code execution
//       }
//     } else if (shareType === 'role-based') {
//       users = await User.find({ role });
//       console.log('Users fetched by role:', users);
//       if (!users.length) {
//         res.status(404).send({ error: 'No users found for the specified role.' });
//         return; // Ensure no further code execution
//       }
//     } else {
//       res.status(400).send({ error: 'Invalid share type.' });
//       return; // Ensure no further code execution
//     }

//     // Retrieve file from MinIO
//     const fileStream = await minioClient.getObject('my-bucket', fileName);
//     const fileBuffer = await streamToBuffer(fileStream);

//     // Prepare to send emails
//     const emailPromises = users.map(user =>
//       transporter.sendMail({
//         from: process.env.GMAIL_USER,
//         to: user.email,
//         subject: 'File Shared with You',
//         text: `Download your file from the link below or open the attachment.`,
//         attachments: [{ filename: fileName, content: fileBuffer }],
//       })
//     );

//     await Promise.all(emailPromises);

//     res.status(200).send({
//       message: 'File shared successfully.',
//       sharedWith: users.map(user => user.email),
//     });
//   } catch (err) {
//     console.error('Error occurred during file sharing:', err);
//     res.status(500).send({ error: 'Failed to share the file.', details: err });
//   }
// };



//storing wihtout user info
// import { Request, Response } from 'express';
// import { minioClient } from '../config/minoConfig';
// import multer from 'multer';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Middleware for handling file upload route
// export const uploadMiddleware = upload.single('file');

// // Upload file handler
// export const uploadFile = async (req: Request, res: Response): Promise<void> => {
//   const bucketName = 'my-bucket';
//   const file = req.file;

//   if (!file) {
//     res.status(400).send({ error: 'No file uploaded.' });
//     return; // Ensure no further code execution
//   }

//   try {
//     // Ensure the bucket exists
//     const bucketExists = await minioClient.bucketExists(bucketName);
//     if (!bucketExists) {
//       await minioClient.makeBucket(bucketName, '');
//       console.log(`Bucket ${bucketName} created.`);
//     }

//     // Upload file to MinIO
//     await minioClient.putObject(bucketName, file.originalname, file.buffer, file.buffer.length, {
//       'Content-Type': file.mimetype,
//     });

//     console.log(`File ${file.originalname} uploaded to ${bucketName}`);

//     // Generate a presigned URL for the uploaded file
//     const downloadUrl = await generatePresignedUrl(bucketName, file.originalname);

//     res.status(200).send({
//       message: 'File uploaded successfully.',
//       fileName: file.originalname,
//       downloadUrl, // Include the presigned URL in the response
//     });
//   } catch (err) {
//     console.error('Error during file upload:', err);
//     res.status(500).send({ error: 'Failed to upload the file.', details: err });
//   }
// };

// // Function to generate a presigned URL for the uploaded file
// const generatePresignedUrl = async (bucketName: string, objectName: string): Promise<string> => {
//   try {
//     const url = await minioClient.presignedUrl('GET', bucketName, objectName, 24 * 60 * 60); // URL valid for 1 day
//     return url;
//   } catch (err) {
//     console.error('Error generating presigned URL:', err);
//     throw err;
//   }
// };





import { Request, Response } from 'express';
import { minioClient } from '../config/minoConfig';
import { User } from '../models/user.model'; // Assuming you still want to fetch users for role-based sharing
import nodemailer from 'nodemailer';
import { Readable } from 'stream';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for handling file upload route
export const uploadMiddleware = upload.single('file');

// Upload file handler
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  const bucketName = 'my-bucket';
  const file = req.file;

  if (!file) {
    res.status(400).send({ error: 'No file uploaded.' });
    return; // Ensure no further code execution
  }

  try {
    // Ensure the bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, '');
      console.log(`Bucket ${bucketName} created.`);
    }

    // Upload file to MinIO
    await minioClient.putObject(bucketName, file.originalname, file.buffer, file.buffer.length, {
      'Content-Type': file.mimetype,
    });

    console.log(`File ${file.originalname} uploaded to ${bucketName}`);

    res.status(200).send({
      message: 'File uploaded successfully.',
      fileName: file.originalname,
      downloadUrl: await generatePresignedUrl(bucketName, file.originalname), // Generate and include the download URL
    });
  } catch (err) {
    console.error('Error during file upload:', err);
    res.status(500).send({ error: 'Failed to upload the file.', details: err });
  }
};

// Function to generate a presigned URL for the uploaded file
const generatePresignedUrl = async (bucketName: string, objectName: string): Promise<string> => {
  try {
    const url = await minioClient.presignedUrl('GET', bucketName, objectName, 24 * 60 * 60); // URL valid for 1 day
    return url;
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    throw err;
  }
};

// Share File Handler (optional if you want to keep this functionality)
export const shareFile = async (req: Request, res: Response): Promise<void> => {
  const { fileName } = req.body;

  if (!fileName) {
    res.status(400).send({ error: 'Missing required fields.' });
    return; // Ensure no further code execution
  }

  try {
    console.log('Received request to share file:', { fileName });

    // Check if the file exists before sharing
    const fileExists = await checkFileExists('my-bucket', fileName);
    if (!fileExists) {
      res.status(404).send({ error: 'File not found.' });
      return; // Ensure no further code execution
    }

    // Generate a presigned URL for the file
    const downloadUrl = await generatePresignedUrl('my-bucket', fileName);

    res.status(200).send({
      message: 'File shared successfully.',
      downloadUrl,
    });
  } catch (err) {
    console.error('Error occurred during file sharing:', err);
    res.status(500).send({ error: 'Failed to share the file.', details: err });
  }
};

// Helper function to check if a file exists in MinIO (if still needed)
const checkFileExists = async (bucket: string, key: string): Promise<boolean> => {
  try {
    await minioClient.statObject(bucket, key);
    return true;
  } catch (err) {
    if ((err as any).code === 'NoSuchKey') {
      return false;
    }
    throw err;
  }
};





