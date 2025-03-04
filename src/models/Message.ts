import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  formId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create indexes for better query performance
MessageSchema.index({ userId: 1, createdAt: -1 });
MessageSchema.index({ formId: 1, createdAt: -1 });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema); 