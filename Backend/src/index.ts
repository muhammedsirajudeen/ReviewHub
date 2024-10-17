import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import connectDB from './model/dbConnect';
import cors from 'cors';
import http from 'http';
//routes
import AuthRoute from './routes/AuthRoutes';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ReviewerRoutes from './routes/ReviewerRoutes';
import SubscriptionRoutes from './routes/SubscriptionRoutes';
import ErrorController from './controller/ErrorController';

import path from 'path';
import passport from 'passport';
import corsOptions from './helper/corsOptions';
import User from './model/User';
import { sendNotification } from './services/subscriptionService';
import { createClient } from 'redis';
import { ConnectionOptions, Job, Worker } from 'bullmq';
import { schedulerProps } from './helper/bullmqIntegration';
import Notification, { Type } from './model/Notification';
import { ExpressPeerServer, IClient } from 'peer';
import socketInitializer from './socketio-server/socket';

const app = express();

const server = http.createServer(app);

//TODO: Implement secret key based system inorder for the reviewer and reviewee to be connected right now its not that secure go with the first implementation
const peerServer = ExpressPeerServer(server, {
  path: '/myapp',
});
const connectedPeers: Record<string, IClient> = {};

peerServer.on('connection', (peer) => {
  connectedPeers[peer.getId()] = peer;
});
peerServer.on('disconnect', (id) => {
  console.log('Disconnected', id.getId());
  delete connectedPeers[id.getId()];
});
peerServer.on('error', (error) => {
  console.log(error);
});

app.use('/peerjs', peerServer);
//setting up the websocket here
socketInitializer(server);

const port = process.env.PORT ?? 3000;
connectDB();

const client = createClient({
  url: process.env.REDIS_URL,
});
client.connect().then(() => console.log('Connected to Redis'));

const connection: ConnectionOptions = {
  host:  process.env.REDIS_HOST,
  port: 6379,
};

const worker = new Worker(
  'reviewScheduler',
  async (job: Job) => {
    console.log(`Processing job: ${job.name}`);
    console.log(`Job data:`, job.data);
    const scheduledMessage = JSON.parse(job.data.message) as schedulerProps;
    //adding notiification to db
    const newNotification = new Notification({
      userId: scheduledMessage.revieweeId,
      message: 'You have  a review join now to avoid cancellation',
      type: Type.Review,
      reviewId: scheduledMessage.reviewId,
    });
    await newNotification.save();
    const newNotificationtwo = new Notification({
      userId: scheduledMessage.reviewerId,
      message: 'You have a review to take',
      type: Type.Review,
      reviewId: scheduledMessage.reviewId,
    });
    await newNotificationtwo.save();
    //this is for sending ws
    // const revieweeId=await getValueFromCache(`socket-${scheduledMessage.revieweeId}`)
    // const reviewerId=await getValueFromCache(`socket-${scheduledMessage.reviewerId}`)
    //if there is now reviewee id it means user is not online otherwise it means that the user is online we can make it accordingly then like a notification on the app bar
    const RevieweeEmail = (await User.findById(scheduledMessage.revieweeId))
      ?.email;
    const ReviewerEmail = (await User.findById(scheduledMessage.reviewerId))
      ?.email;
    sendNotification(
      'admin',
      'You Have A Review Right Now',
      'https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF',
      RevieweeEmail as string
    );
    sendNotification(
      'admin',
      'You Have A Review Right Now',
      'https://img.icons8.com/?size=100&id=32309&format=png&color=FFFFFF',
      ReviewerEmail as string
    );

    // Add your task logic here
  },
  { connection }
);

// Handle worker errors
worker.on('failed', (job, err) => {
  console.error(`Job failed`, err);
});
app.use(cors(corsOptions));
// Configure CORS options
app.use(passport.initialize());
// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, './public')));
// Routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoutes);
app.use('/admin', AdminRoutes);
app.use('/reviewer', ReviewerRoutes);
app.use('/notification', SubscriptionRoutes);
app.use(ErrorController);

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
