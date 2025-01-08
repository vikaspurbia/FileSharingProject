import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  sharedWith: [String],  // List of user emails
  shareType: { type: String, enum: ['individually', 'multi-user', 'role-based'], required: true },
  expirationDate: { type: Date, required: true },
});

const File = mongoose.model('File', fileSchema);

export { File };
