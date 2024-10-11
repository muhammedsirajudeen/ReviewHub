import mongoose, { Schema } from 'mongoose';

export interface IDomain extends Document {
  domain: string;
}

const DomainSchema = new Schema<IDomain>({
  domain: {
    type: String,
    required: true,
    unique: true,
  },
});

const Domain = mongoose.model<IDomain>('domain', DomainSchema);
export default Domain;
