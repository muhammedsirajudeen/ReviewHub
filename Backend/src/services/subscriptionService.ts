import webPush from 'web-push';
import Subscription from '../model/Subscription';
import mongoose from 'mongoose';
import User from '../model/User';
// Configure VAPID keys
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY as string,
  privateKey: process.env.VAPID_PRIVATE_KEY as string,
};

webPush.setVapidDetails(
  'mailto:muhammedsirajudeen29@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export const saveSubscription = async (
  subscription: any,
  userId: string
): Promise<void> => {
  await Subscription.create({
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
    userId: userId,
  });
};

export const sendNotification = async (
  title: string,
  body: string,
  image: string,
  email: string
): Promise<void> => {
  const user = await User.findOne({ email: email });
  const subscription = await Subscription.findOne({
    userId: new mongoose.Types.ObjectId(user?.id as string),
  });
  if (subscription) {
    const sub = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };
    const payload = JSON.stringify({
      notification: {
        title,
        body,
        image,
      },
    });
    webPush
      .sendNotification(sub, payload)
      .catch((error) => console.error('Error sending notification:', error));
  } else {
    console.log('user has not subscribed yet');
  }
};
