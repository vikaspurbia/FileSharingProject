import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  role: string;
}

const userSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
