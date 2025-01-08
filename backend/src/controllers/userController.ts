import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  console.log('addUser controller hit'); // This will show if the controller is being called
  console.log('Request body:', req.body); // Check the request data
  const { email, role } = req.body;

  try {
    const newUser = new User({ email, role });
    await newUser.save();
    res.status(201).send({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error in addUser controller:', error);
    next(error); // Pass error to the error handler middleware
  }
};



export const getUsersEmails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}, 'email'); // Fetch only the email field
    const emails = users.map(user => user.email); // Extract emails

    res.status(200).json(emails); // Send emails as response
  } catch (error) {
    console.error('Error fetching emails:', error);
    next(error); // Pass error to the error handler middleware
  }
};