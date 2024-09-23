import { Request, Response } from 'express';
import User, { IUser } from '../../model/User';
import mongoose from 'mongoose';

const GetEnroll = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const {progress}=req.query
    let { page } = req.query ?? '1';
    const length = user.enrolledCourses.length;
    //implement pagination here as its coming as a nested element has to perform directly on the array
    let enrolledCourses
    if(progress){
        enrolledCourses=(await User.findById(user.id).populate('enrolledCourses'))?.enrolledCourses
    }else{
        enrolledCourses = user.enrolledCourses;
    }
    res
      .status(200)
      .json({ message: 'success', enrolledCourses: enrolledCourses, pageLength:length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const GetEnrollById = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { courseId } = req.params;
    if (courseId) {
      const enrolledCourses = await User.findOne({
        _id: user.id,
        enrolledCourses: { $in: [courseId] },
      });
      // console.log(enrolledCourses)
      if (enrolledCourses) {
        res.status(200).json({ message: 'success' });
      } else {
        res.status(404).json({ message: 'resource not found' });
      }
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const Enroll = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { courseId } = req.body;
    if (courseId) {
      await User.updateOne(
        {
          _id: user.id,
        },
        {
          $addToSet: { enrolledCourses: courseId },
        }
      );
      res.status(201).json({ message: 'success' });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'success' });
  }
};

const DeleteEnrollById = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { courseId } = req.params;
    if (courseId) {
      await User.updateOne(
        { _id: user.id },
        { $pull: { enrolledCourses: new mongoose.Types.ObjectId(courseId) } }
      );
      res.status(200).json({ message: 'success' });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetEnroll,
  Enroll,
  GetEnrollById,
  DeleteEnrollById,
};
