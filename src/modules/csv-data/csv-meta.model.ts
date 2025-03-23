import mongoose, { Schema, Document } from 'mongoose';

export interface ICsvMeta extends Document {
  columns: string[];
  createdAt: Date;
}

const CsvMetaSchema: Schema = new Schema({
  columns: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICsvMeta>('CsvMeta', CsvMetaSchema);
