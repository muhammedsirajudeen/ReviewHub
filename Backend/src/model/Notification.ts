import mongoose from 'mongoose';

export enum Type {
  Review = 'review',
}
export interface INotification extends Document {
  message: string;
  userId: mongoose.Types.ObjectId;
  type: Type;
  date: Date;
  reviewId:mongoose.Types.ObjectId
}

const NotificationSchema = new mongoose.Schema<INotification>({
  message: {
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
    required: true,
  },
  date: {
    type: Date,
    required: false,
    default: new Date(),
  },
  reviewId:{
    type:mongoose.Schema.ObjectId,
    required:true,
    ref:'review'
  }
});

const Notification = mongoose.model('notification', NotificationSchema);

export default Notification;
