import { Server as httpServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  addValueToCache,
  getValueFromCache,
  removeValueFromCache,
} from '../helper/redisHelper';
import mongoose from 'mongoose';
import Chat from '../model/Chat';
import { sendNotification } from '../services/subscriptionService';
import User, { IUser } from '../model/User';
import UnreadChat from '../model/UnreadChat';
import verifyToken from '../helper/tokenVerifier';

export interface JwtPayload {
  id: string; // or whatever your user ID type is
  email: string; // or any other user-related fields
  // Add more fields if necessary
}

interface SocketwithUser extends Socket {
  user?: string;
  email?: string;
}

const socketInitializer = (server: httpServer) => {
  const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN } });
  io.on('connection', async (socket: SocketwithUser) => {
    try {
      //toke verification has to make sure it works with refresh tokens though it should
      const token = socket.handshake.auth.token as string;
      console.log(token);
      if (!token) {
        return socket.disconnect();
      }
      const decoded = (await verifyToken(token)) as IUser;
      socket.user = decoded.id;
      socket.email = decoded.email;
      addValueToCache(`socket-${socket.user}`, socket.id, 3600);
    } catch (error) {
      console.log(error);
    }
    console.log('A user connected:', socket.user);
    socket.on('typing', async (msg) => {
      const parsedMessage = JSON.parse(msg);
      const recieverUser = await User.findOne({ email: parsedMessage.to });
      const receieverId = recieverUser?.id;
      const socketId = await getValueFromCache(`socket-${receieverId}`);
      if (socketId) {
        io.to(socketId).emit('typing', JSON.stringify(parsedMessage));
      }
    });
    socket.on('message', async (msg) => {
      const parsedMessage = JSON.parse(msg);
      console.log(parsedMessage);
      const recieverUser = await User.findOne({ email: parsedMessage.to });
      const receieverId = recieverUser?.id;
      const socketId = await getValueFromCache(`socket-${receieverId}`);
      //sending message to the user
      if (socketId) {
        io.to(socketId).emit('message', JSON.stringify(parsedMessage));
        // sendNotification(parsedMessage.from,parsedMessage.message,'https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF',parsedMessage.to)
      } else {
        console.log('user is not online');
        //add chat here
        const unreadChat = await UnreadChat.findOne({
          userId: socket.user,
          messageUserId: receieverId,
        });
        console.log(unreadChat);
        if (!unreadChat) {
          const newUnread = new UnreadChat({
            userId: socket.user,
            messageUserId: receieverId,
            messageCount: 1,
          });
          newUnread.save();
        } else {
          unreadChat.messageCount++;
          await unreadChat.save();
        }

        //so we add the unread message count kinda here maybe in db or in seperate connection whichever is viable  ToDo
        const profileImage = await User.findOne({ email: parsedMessage.from });
        sendNotification(
          parsedMessage.from,
          parsedMessage.message,
          profileImage?.profileImage as string,
          parsedMessage.to
        );
      }

      //this entire logic is the chat adding in the db logic
      if (receieverId) {
        const objectIdOne = new mongoose.Types.ObjectId(socket.user as string);
        const objectIdTwo = new mongoose.Types.ObjectId(receieverId as string);
        const newChat = await Chat.findOne({
          userId: { $all: [objectIdOne, objectIdTwo] },
        });
        //new chat with new user
        if (!newChat) {
          const newChat = new Chat({
            userId: [objectIdOne, objectIdTwo],
            messages: [
              {
                from: socket.email,
                to: parsedMessage.to,
                message: parsedMessage.message,
                uuid: parsedMessage.uuid,
                repliedto: parsedMessage.repliedto ?? '',
              },
            ],
          });
          await newChat.save();
        } else {
          //sadhanam und
          newChat.messages.push({
            from: socket.email as string,
            to: parsedMessage.to,
            message: parsedMessage.message,
            uuid: parsedMessage.uuid,
            repliedto: parsedMessage.repliedto ?? '',
          });
          await newChat.save();
        }
      }
    });
    //scheduling logic here

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      removeValueFromCache(`socket-${socket.user}`);
    });
  });
  return io;
};

export default socketInitializer;
