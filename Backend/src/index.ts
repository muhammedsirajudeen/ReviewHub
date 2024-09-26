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
import ErrorController from "./controller/ErrorController";

import path from "path";
import passport from "passport";
import corsOptions from "./helper/corsOptions";
import verifyToken from "./helper/tokenVerifier";
import { IUser } from "./model/User";
import { addValueToCache } from "./helper/redisHelper";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:'http://localhost:5173'}});
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
    socket.user=decoded.email
    addValueToCache(`socket-${socket.user}`,socket.id,3600)
  }catch(error){
    console.log(error)

  }
  console.log('A user connected:', socket.user);
  socket.on('chat message', (msg) => {
      console.log('Message received:', msg);

  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
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

app.use(ErrorController);


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
