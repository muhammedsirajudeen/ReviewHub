import mongoose, { Document, Schema } from 'mongoose';

// Define the Subscription interface
interface ISubscription extends Document {
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId:mongoose.Types.ObjectId
}

// Define the Subscription schema
const subscriptionSchema: Schema = new Schema({
  endpoint: {
    type: String,
    required: true
  },
  p256dh: {
    type: String,
    required: true
  },
  auth: {
    type: String,
    required: true
  },
  userId:{
    type:mongoose.Schema.ObjectId,
    required:true
  }
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

// Create the Subscription model
const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);

export default Subscription;
