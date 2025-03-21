import mongoose, { Schema } from 'mongoose';

interface IPayment extends Document {
  amount: number;
  status: boolean;
  orderId: string;
  userId: mongoose.Types.ObjectId;
  type: string;
  paymentDate: Date;
}

const PaymentSchema = new Schema<IPayment>({
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  type: {
    type: String,
    required: false,
    default: 'wallet',
  },
  paymentDate: {
    type: Date,
    required: false,
    default: new Date(),
  },
});

const Payment = mongoose.model('payments', PaymentSchema);

export default Payment;
