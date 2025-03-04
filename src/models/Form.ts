import mongoose from 'mongoose';

export interface IForm extends mongoose.Document {
  uniqueId: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  requestUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema = new mongoose.Schema({
  uniqueId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
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
  requestUrl: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create indexes for better query performance
FormSchema.index({ userId: 1, createdAt: -1 });
FormSchema.index({ uniqueId: 1 }, { unique: true });

export const Form = mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema); 