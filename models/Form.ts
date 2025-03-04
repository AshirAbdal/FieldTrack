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
    required: true  // Remove unique:true from here
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  requestUrl: { type: String, required: true }
}, {
  timestamps: true
});

// Keep only one index definition
FormSchema.index({ userId: 1, createdAt: -1 });
FormSchema.index({ uniqueId: 1 }, { unique: true }); // Unique index here

export const Form = mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema);