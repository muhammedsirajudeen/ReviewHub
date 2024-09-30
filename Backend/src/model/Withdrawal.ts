import mongoose, { Schema } from 'mongoose';
interface paymentMethodprops {
  bankaccount: string;
  ifsc: string;
  holdername: string;
}

interface IWithdrawal extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  date?: Date;
  status: string;
  completed: boolean;
  paymentMethod: paymentMethodprops[];
}

const PaymentMethodSchema = new Schema<paymentMethodprops>({
  bankaccount: {
    type: String,
    required: false,
  },
  ifsc: {
    type: String,
    required: false,
  },
  holdername: {
    type: String,
    required: false,
  },
});

const WithdrawalSchema = new mongoose.Schema<IWithdrawal>({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: new Date(),
  },
  status: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
  paymentMethod: {
    type: [PaymentMethodSchema],
    required: true,
  },
});

const Withdrawal = mongoose.model<IWithdrawal>('withdrawal', WithdrawalSchema);
export default Withdrawal;
