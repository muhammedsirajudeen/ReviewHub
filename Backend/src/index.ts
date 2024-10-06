import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import connectDB from "./model/dbConnect";
import cors from "cors";
import { Server, Socket } from 'socket.io';
import http from "http"
//routes
import AuthRoute from "../src/routes/AuthRoutes";
import UserRoutes from "./routes/UserRoutes"
import AdminRoutes from "./routes/AdminRoutes"
import ReviewerRoutes from "./routes/ReviewerRoutes"
import SubscriptionRoutes from "./routes/SubscriptionRoutes"
import ErrorController from "./controller/ErrorController";

import path from "path";
import passport from "passport";
import corsOptions from "./helper/corsOptions";
import verifyToken from "./helper/tokenVerifier";
import User, { IUser } from "./model/User";
import { addValueToCache, getValueFromCache, removeValueFromCache } from "./helper/redisHelper";
import Chat from "./model/Chat";
import mongoose from "mongoose";
import { sendNotification } from "./services/subscriptionService";
import UnreadChat from "./model/UnreadChat";
import { createClient } from "redis";
import { ConnectionOptions, Job,Worker } from "bullmq";
import { schedulerProps } from "./helper/bullmqIntegration";
import Notification, { Type } from "./model/Notification";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:process.env.CORS_ORIGIN}});
const port = process.env.PORT ?? 3000;
connectDB();

// types.ts

export interface JwtPayload {
  id: string; // or whatever your user ID type is
  email: string; // or any other user-related fields
  // Add more fields if necessary
}


interface SocketwithUser extends Socket{
  user?:string
  email?:string
}

const client = createClient({
  url: process.env.REDIS_URL, 
});
client.connect().then(() => console.log('Connected to Redis'));

const connection: ConnectionOptions = {
  host: 'localhost', 
  port: 6379,
};

const worker = new Worker(
  'reviewScheduler',
  async (job: Job) => {
    console.log(`Processing job: ${job.name}`);
    console.log(`Job data:`, job.data);
    const scheduledMessage=JSON.parse(job.data.message) as schedulerProps
    //adding notiification to db
    const newNotification=new Notification(
      {
        userId:scheduledMessage.revieweeId,
        message:"You have  a review join now to avoid cancellation",
        type:Type.Review,
        reviewId:scheduledMessage.reviewId
      }
    )
    await newNotification.save()
    const newNotificationtwo=new Notification(
      {
        userId:scheduledMessage.reviewerId,
        message:"You have a review to take",
        type:Type.Review,
        reviewId:scheduledMessage.reviewId
      }
    )
    await newNotificationtwo.save()
    //this is for sending ws
    const revieweeId=await getValueFromCache(`socket-${scheduledMessage.revieweeId}`)
    const reviewerId=await getValueFromCache(`socket-${scheduledMessage.reviewerId}`)
    //if there is now reviewee id it means user is not online otherwise it means that the user is online we can make it accordingly then like a notification on the app bar
    const RevieweeEmail=(await User.findById(scheduledMessage.revieweeId))?.email
    const ReviewerEmail=(await User.findById(scheduledMessage.reviewerId))?.email
    sendNotification("admin","You Have A Review Right Now",'https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF',RevieweeEmail as string )
    sendNotification("admin","You Have A Review Right Now",'https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF',ReviewerEmail as string)

    // Add your task logic here
  },
  { connection }
);

// Handle worker errors
worker.on('failed', (job, err) => {
  console.error(`Job failed`, err);
});

//socket logic here
io.on('connection', async (socket:SocketwithUser) => {
  try{
    //toke verification has to make sure it works with refresh tokens though it should
    const token = socket.handshake.auth.token as string ;
    console.log(token)
    if (!token) {
      return socket.disconnect()
    }
    const decoded=await verifyToken(token) as IUser
    socket.user=decoded.id
    socket.email=decoded.email
    addValueToCache(`socket-${socket.user}`,socket.id,3600)
    
  }catch(error){
    console.log(error)

  }
  console.log('A user connected:', socket.user);
  socket.on('message', async (msg) => {
      const parsedMessage=JSON.parse(msg)
      console.log(parsedMessage.to)
      const recieverUser=await User.findOne({email:parsedMessage.to})
      const receieverId=recieverUser?.id
      const socketId=await getValueFromCache(`socket-${receieverId}`)
      console.log("the id is",socketId)
      //sending message to the user
      if(socketId){
        io.to(socketId).emit('message',JSON.stringify(parsedMessage))
        // sendNotification(parsedMessage.from,parsedMessage.message,'https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF',parsedMessage.to)
      }else{
        console.log("user is not online")
        //add chat here
        const unreadChat=await UnreadChat.findOne({userId:socket.user,messageUserId:receieverId})
        console.log(unreadChat)
        if(!unreadChat){
          const newUnread=new UnreadChat(
            {
              userId:socket.user,
              messageUserId:receieverId,
              messageCount:1
            }
          )
          newUnread.save()
        }else{
          unreadChat.messageCount++
          await unreadChat.save()
        }

        //so we add the unread message count kinda here maybe in db or in seperate connection whichever is viable  ToDo
        const profileImage=await User.findOne({email:parsedMessage.from})
        sendNotification(parsedMessage.from,parsedMessage.message,profileImage?.profileImage as string,parsedMessage.to)

      }

      //this entire logic is the chat adding in the db logic
      if(receieverId){
        const objectIdOne=new mongoose.Types.ObjectId(socket.user as string)
        const objectIdTwo=new mongoose.Types.ObjectId(receieverId as string)
        const newChat=await Chat.findOne({userId:{$all:[objectIdOne,objectIdTwo]}})
        //new chat with new user
        if(!newChat){
          const newChat=new Chat(
            {
              userId:[objectIdOne,objectIdTwo],
              messages:[
                {
                  from:socket.email,
                  to:parsedMessage.to,
                  message:parsedMessage.message
                }
              ]
            }
          )
          await newChat.save()
        }else{
          //sadhanam und
          newChat.messages.push(
            {
              from:socket.email as string,
              to:parsedMessage.to,
              message:parsedMessage.message

            }
          )
          await newChat.save()
        }
      }

  });
  //scheduling logic here

  
  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      removeValueFromCache(`socket-${socket.user}`)
  });
});



// Configure CORS options
app.use(passport.initialize());
app.use(cors(corsOptions));
// Middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true,limit: '50mb'}));
app.use(express.static(path.join(__dirname, './public')));
// Routes
app.use("/auth", AuthRoute);
app.use("/user",UserRoutes)
app.use("/admin",AdminRoutes)
app.use("/reviewer",ReviewerRoutes)
app.use("/notification",SubscriptionRoutes)
app.use(ErrorController);


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
