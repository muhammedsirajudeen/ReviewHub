import express, { Request, Response } from "express";
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
        //so we add the unread message count kinda here maybe in db or in seperate connection whichever is viable  ToDo
        sendNotification(parsedMessage.from,parsedMessage.message,'https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF',parsedMessage.to)

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
