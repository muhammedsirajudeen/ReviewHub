import mongoose from 'mongoose';
import { IUser } from './User';

export interface messageProps {
  from: String;
  to: String;
  message: string;
  time?:Date
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId[] | IUser[];
  messages: Array<messageProps>;
}

export const messageSchema = new mongoose.Schema<messageProps>({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    minlength: 1,
    validate: (message: string) => {
      if (message.trim() === '') {
        return false;
      } else {
        return true;
      }
    },

  },
  time:{
    type:Date,
    default:new Date()
  }
});

const ChatSchema = new mongoose.Schema<IChat>({
  userId: {
    type:[mongoose.Schema.Types.Mixed],
    ref:'User'
  },
  messages: [messageSchema],
});

const Chat = mongoose.model<IChat>('chats', ChatSchema);

export default Chat;
