import { Request, Response } from 'express';
import Resource from '../../model/Resource';
import mongoose from 'mongoose';
import Quiz from '../../model/Quiz';

const GetResources = async (req: Request, res: Response) => {
  try {
    const { roadmapId } = req.params;
    console.log(roadmapId);
    const Resources = await Resource.find({
      roadmapId: new mongoose.Types.ObjectId(roadmapId as string),
    });
    console.log(Resources);
    const Quizes = await Quiz.find({
      roadmapId: new mongoose.Types.ObjectId(roadmapId as string),
    });
    res
      .status(200)
      .json({ message: 'success', resource: Resources, quiz: Quizes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'success' });
  }
};

export default {
  GetResources,
};
