import mongoose, { Document, Schema } from 'mongoose';

interface paymentMethodprops {
  bankaccount: string;
  ifsc: string;
  holdername: string;
}
export interface IUser extends Document {
  email: string; // Optional field for user's name
  password: string; // Optional field for user's email
  profileImage: string;
  phone: string;
  address: string;
  authorization: string;
  enrolledCourses: Array<mongoose.Types.ObjectId>;
  rewardPoints: number;
  walletId: mongoose.Types.ObjectId;
  attendedQuizes: mongoose.Types.ObjectId[];
  verified: boolean;
  reviewerApproval: boolean;
  premiumMember: boolean;
  favoriteCourses: Array<mongoose.Types.ObjectId>;
  paymentMethod: paymentMethodprops[];
  lastSeen?: Date;
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

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
    minlength: 8,
    validate: (password: string) => {
      if (password.trim() === '') {
        return false;
      } else {
        return true;
      }
    },
  },
  profileImage: {
    type: String,
    required: false,
    unique: false,
  },
  phone: {
    type: String,
    required: false,
    unique: false,
  },
  address: {
    type: String,
    required: false,
    unique: false,
  },
  authorization: {
    type: String,
    required: false,
    unique: false,
  },
  enrolledCourses: {
    type: [mongoose.Schema.ObjectId],
    required: false,
    unique: false,
    ref: 'courses',
    default:[]
  },
  rewardPoints: {
    type: Number,
    required: false,
    unique: false,
    default: 0,
  },
  walletId: {
    type: mongoose.Schema.ObjectId,
    required: false,
    unique: false,
    ref: 'wallets',
  },
  attendedQuizes: {
    type: [mongoose.Schema.ObjectId],
    required: false,
    default: [],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  reviewerApproval: {
    type: Boolean,
    default: false,
  },
  premiumMember: {
    type: Boolean,
    required: false,
    default: false,
  },
  favoriteCourses: {
    type: [mongoose.Schema.ObjectId],
    required: false,
    default: [],
  },
  paymentMethod: {
    type: [PaymentMethodSchema],
    required: false,
    default: [],
  },
  lastSeen: {
    type: Date,
    required: false,
    default: new Date(),
  },
});
const User = mongoose.model<IUser>('User', userSchema);
export default User;
