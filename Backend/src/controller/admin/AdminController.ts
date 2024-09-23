import { Request, Response } from 'express';
import User from '../../model/User';
import { IUser } from '../../model/User';
import Approval from '../../model/Approval';
import { PAGE_LIMIT } from '../user/CourseController';

const backendUrl = 'http://localhost:3000/';

const AllUsers = async (req: Request, res: Response) => {
  try {
    let user = req.user as IUser;
    let { page } = req.query ?? '1';
    const length = (await User.find()).length;
    if (user.authorization !== 'admin') {
      return res.status(403).json({ message: 'insufficient permissions' });
    }
    const users = await User.find()
      .select('-password')
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
    const excludeUsers = users.filter((user) => user.authorization !== 'admin');

    res
      .status(200)
      .json({ message: 'success', users: excludeUsers, pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const DeleteUser = async (req: Request, res: Response) => {
  try {
    let user = req.user as IUser;
    if (user.authorization !== 'admin') {
      return res.status(403).json({ message: 'insufficient permissions' });
    }
    const { email } = req.params;
    await User.findOneAndDelete({ email: email });
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const UpdateUser = async (req: Request, res: Response) => {
  try {
    let userhere = req.user as IUser;

    if (userhere.authorization !== 'admin') {
      return res.status(401).json({ message: 'insufficient permissions' });
    }
    const { email, currentemail, phone, address, profileImage } = req.body;
    const checkUser = await User.findOne({ email: currentemail });
    let filename;
    if (req.file?.filename) {
      filename = backendUrl + req.file.filename;
    } else if (checkUser?.profileImage) {
      filename = checkUser.profileImage;
    }
    const user = await User.findByIdAndUpdate(
      { _id: checkUser?._id },
      {
        email,
        phone,
        address,
        profileImage:
          filename ??
          'https://img.icons8.com/ios-glyphs/30/1A1A1A/user--v1.png',
      }
    );

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const AllApprovals = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    let { page } = req.query ?? '1';
    const length = (await Approval.find()).length;

    if (user.authorization !== 'admin') {
      res.status(401).json({ message: 'success' });
      return;
    }
    const Approvals = await Approval.find()
      .populate('userId')
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);

    res
      .status(200)
      .json({ message: 'success', approvals: Approvals, pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'success' });
  }
};

const ApproveReviewer = async (req: Request, res: Response) => {
  try {
    const adminuser = req.user as IUser;
    const { approvalId } = req.params;
    if (adminuser.authorization !== 'admin') {
      res.status(401).json({ message: 'Unauthorized' });
    }
    const updateApproval = await Approval.findById(approvalId);
    const user = await User.findById(updateApproval?.userId);
    if (updateApproval && user) {
      updateApproval.approvalStatus = !updateApproval.approvalStatus;
      await updateApproval.save();
      user.reviewerApproval = !user.reviewerApproval;
      await user.save();
      res.status(200).json({ message: 'success' });
    } else {
      res.status(404).json({ messagae: 'approval request not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'success' });
  }
};

export default {
  AllUsers,
  DeleteUser,
  UpdateUser,
  AllApprovals,
  ApproveReviewer,
};
