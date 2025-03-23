import mongoose, { Schema, Document } from 'mongoose';

export interface ICsvStatus extends Document {
  status: 'idle' | 'processing' | 'done' | 'error';
  runId: string;
  message: string;
  createdAt: Date;
}

const CsvStatusSchema = new Schema({
  status: { type: String, default: 'idle' },
  runId: { type: String, required: true },
  message: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICsvStatus>('CsvStatus', CsvStatusSchema);
