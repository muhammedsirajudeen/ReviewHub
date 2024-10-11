import { Request, Response } from 'express';
import { saveSubscription } from '../../services/subscriptionService';
import { IUser } from '../../model/User';
import Subscription from '../../model/Subscription';

const subscribe = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const subscription = req.body;
    const checkSubscription = await Subscription.findOne({ userId: user.id });
    if (!checkSubscription) {
      await saveSubscription(subscription, user.id);

      res.status(201).json({ message: 'Subscription added successfully.' });
    } else {
      // endpoint: subscription.endpoint,
      // p256dh: subscription.keys.p256dh,
      // auth: subscription.keys.auth,
      checkSubscription.endpoint = subscription.endpoint;
      checkSubscription.p256dh = subscription.keys.p256dh;
      checkSubscription.auth = subscription.keys.auth;
      await checkSubscription.save();
      res.status(200).json({ message: 'Subscription updated successfully.' });
    }
    // sendNotification('hello','hello','hello',user.email)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to subscribe.' });
  }
};

// const pushNotification = async (req: Request, res: Response) => {
//   try {
//     const { title, body, image } = req.body;
//     await sendNotification(title, body, image);
//     res.status(200).json({ message: 'Notification sent successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to send notification.' });
//   }
// }

export default {
  subscribe,
  // pushNotification
};
