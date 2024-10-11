import { Request, Response } from 'express';
import Approval from '../../model/Approval';
import { IUser } from '../../model/User';

const ReviewerApproval = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { experience, domain, comment } = req.body;
    const newApproval = new Approval({
      userId: user.id,
      experience,
      domain,
      comment,
      resumeFile: req.file?.filename,
    });
    await newApproval.save();
    res.status(201).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const ApprovalStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const approvalRequest = await Approval.findOne({ userId: user.id });
    if (approvalRequest) {
      res.status(200).json({ message: 'already requested' });
    } else {
      res.status(200).json({ message: 'success' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  ReviewerApproval,
  ApprovalStatus,
};
