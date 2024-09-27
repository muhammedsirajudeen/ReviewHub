import mongoose from 'mongoose';

interface messageProps {
  from: String;
  to: String;
  message: string;
  time?:Date
}

interface IChat extends Document {
  userId: mongoose.Types.ObjectId[];
  messages: Array<messageProps>;
}

const messageSchema = new mongoose.Schema<messageProps>({
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
  userId: [mongoose.Schema.ObjectId],
  messages: [messageSchema],
});

const Chat = mongoose.model<IChat>('chats', ChatSchema);

export default Chat;
