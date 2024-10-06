import { Request, Response } from 'express';
import { IUser } from '../../../model/User';
import Notification from '../../../model/Notification';

const GetNotification = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const Notifications = await Notification.find({ userId: user.id });
    res.status(200).json({ message: 'success', notifications: Notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const DeleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    if (!notificationId) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetNotification,
  DeleteNotification,
};
