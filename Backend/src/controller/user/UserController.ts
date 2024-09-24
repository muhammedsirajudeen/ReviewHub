import { Request, Response } from 'express';
import User, { IUser } from '../../model/User';

const backendUrl = 'http://localhost:3000/';

const UserUpdate = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { phone, address, profileImage, email } = req.body;
    // const checkUser = await User.findOne({ email });
    let filename;
    if (req.file?.filename) {
      filename = req.file.filename;
    } else if (user?.profileImage) {
      filename = user.profileImage;
    }
    user.phone=phone
    user.address=address
    user.profileImage=filename ?? 'https://img.icons8.com/ios-glyphs/30/1A1A1A/user--v1.png',
    await user.save()
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: 'server error' });
  }
};

export default {
  UserUpdate,
};
