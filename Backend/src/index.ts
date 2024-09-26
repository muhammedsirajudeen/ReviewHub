import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import connectDB from "./model/dbConnect";
import cors from "cors";
import { Server } from 'socket.io';
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

const app = express();
const server = http.createServer(app);
const io = new Server(server,{cors:{origin:'http://localhost:5173'}});
const port = process.env.PORT ?? 3000;
connectDB();


//socket logic here
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages
  socket.on('chat message', (msg) => {
      console.log('Message received:', msg);
      // Broadcast the message to all connected clients
      io.emit('chat message', msg);
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
