import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICsvRow extends Document {
  metaId: Types.ObjectId;
  data: { [key: string]: unknown };
  createdAt: Date;
}

const CsvRowSchema: Schema = new Schema({
  metaId: { type: Schema.Types.ObjectId, ref: 'CsvMeta', required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

CsvRowSchema.index({ metaId: 1, createdAt: -1 });

export default mongoose.model<ICsvRow>('CsvRow', CsvRowSchema);
