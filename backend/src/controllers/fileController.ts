
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
import { User } from '../models/user.model';  // Assuming you still want to fetch users for role-based sharing
import nodemailer from 'nodemailer';
import multer from 'multer';
import dotenv from 'dotenv';
import { File } from '../models/file.model';

dotenv.config();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for handling file upload route
export const uploadMiddleware = upload.single('file');

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  const bucketName = 'my-bucket';
  const file = req.file;
  const userEmail = req.body.userEmail;

  if (!file) {
    res.status(400).send({ error: 'No file uploaded.' });
    return; // Ensure no further code execution
  }

  if (!userEmail) {
    res.status(400).send({ error: 'User email is required.' });
    return; // Ensure no further code execution if email is not provided
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

    const downloadUrl = await generatePresignedUrl(bucketName, file.originalname);

 

    // Store file details in MongoDB (File model)
    const fileRecord = new File({
      fileName: file.originalname,
      sharedWith: [userEmail] ,  // Add email to sharedWith array if provided
      shareType: 'individually',  // Modify based on how you share the file
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration (1 day)
    });

    // Check and log if fileRecord is saved properly
    console.log('File record before save:', fileRecord);
    await fileRecord.save();

    console.log('File record saved successfully:', fileRecord);

    res.status(200).send({
      message: 'File uploaded successfully.',
      fileName: file.originalname,
      downloadUrl,
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

// Share File Handler
export const shareFile = async (req: Request, res: Response): Promise<void> => {
  const { fileName, userEmail, shareType } = req.body;

  if (!fileName || !userEmail) {
    res.status(400).send({ error: 'Missing required fields: fileName, userEmail.' });
    return; // Ensure no further code execution
  }

  try {
    console.log('Received request to share file:', { fileName, userEmail, shareType });

    // Check if the file exists before sharing
    const fileExists = await checkFileExists('my-bucket', fileName);
    if (!fileExists) {
      res.status(404).send({ error: 'File not found.' });
      return; // Ensure no further code execution
    }

    // Verify if the user exists in the system
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      res.status(404).send({ error: 'User not found.' });
      return; // Ensure no further code execution
    }

    // Generate a presigned URL for the file
    const downloadUrl = await generatePresignedUrl('my-bucket', fileName);

    // Fetch file record from the database
    const fileRecord = await File.findOne({ fileName });
    if (fileRecord) {
      // Update file sharing information in MongoDB
      if (!fileRecord.sharedWith.includes(userEmail)) {
        fileRecord.sharedWith.push(userEmail); // Add email to shared list if not already present
        fileRecord.shareType = shareType || 'individually';  // Update share type if provided
        await fileRecord.save();
        console.log('File record updated with shared user:', userEmail);
      } else {
        console.log('User has already been added to shared list.');
      }
    }

    // Send email notification
    sendEmailNotification(userEmail, fileName, downloadUrl);

    res.status(200).send({
      message: 'File shared successfully.',
      downloadUrl,
    });
  } catch (err) {
    console.error('Error occurred during file sharing:', err);
    res.status(500).send({ error: 'Failed to share the file.', details: err });
  }
};

// Helper function to check if a file exists in MinIO
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

// Send email notification
const sendEmailNotification = (email: string, fileName: string, downloadUrl: string): void => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'File Shared With You',
    text: `A file named ${fileName} has been shared with you. You can download it here: ${downloadUrl}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};




export const getBucketData = async (req: Request, res: Response): Promise<void> => {
  const bucketName = 'my-bucket';  // Ensure this matches your actual bucket name

  try {
    console.log('Checking if bucket exists...');

    // Check if the bucket exists
    const bucketExists = await minioClient.bucketExists(bucketName);
    console.log(`Bucket exists: ${bucketExists}`);

    if (!bucketExists) {
      res.status(404).send({ error: `Bucket ${bucketName} does not exist.` });
      return;
    }

    console.log('Bucket found. Listing objects...');

    // List objects in the bucket
    const objectsList: any[] = [];
    const stream = minioClient.listObjectsV2(bucketName, '', true);

    stream.on('data', (obj) => {
      console.log('Object received:', obj);
      objectsList.push(obj);
    });

    stream.on('end', () => {
      console.log('Stream ended. Objects list:', objectsList);
      res.status(200).send({ message: 'Bucket data retrieved successfully.', objectsList });
    });

    stream.on('error', (err) => {
      console.error('Error retrieving bucket data:', err);
      res.status(500).send({ error: 'Error retrieving bucket data.', details: err });
    });

  } catch (err) {
    console.error('Error occurred during bucket data retrieval:', err);
    res.status(500).send({ error: 'Failed to retrieve bucket data.', details: err });
  }
};
