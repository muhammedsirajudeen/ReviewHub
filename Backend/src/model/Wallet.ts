import mongoose, { Schema } from 'mongoose';

interface HistoryProps {
  paymentDate: Date;
  type: string;
  amount: number;
  status:boolean;
  withdrawalId?:mongoose.Types.ObjectId;
  reviewId?:mongoose.Types.ObjectId
}

interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  redeemable: number;
  balance: number;
  history: HistoryProps[];
}

const HistorySchema = new Schema<HistoryProps>({
  paymentDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status:{
    type:Boolean,
    required:false,
    default:false
  },
  withdrawalId:{
    type:mongoose.Schema.ObjectId,
    required:false,
  },
  reviewId:{
    type:mongoose.Schema.ObjectId,
    required:false
  }
});

const WalletSchema = new Schema<IWallet>({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  },
  redeemable: {
    type: Number,
    required: false,
    default: 0,
  },
  balance: {
    type: Number,
    required: false,
    default: 0,
  },
  history: {
    type: [HistorySchema],
    required: false,
    default: [],
  },
  
  
});

const Wallet = mongoose.model<IWallet>('wallets', WalletSchema);
export default Wallet;
