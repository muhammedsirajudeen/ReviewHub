import { Request, Response } from 'express';
import Review from '../../model/Review';
import HttpResponse,{HttpMessage,HttpStatus} from '../../helper/resConstants';
import { unlink } from 'fs/promises';
import path from 'path';

const PAGE_LIMIT = 5;

const ReviewController = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const length = (await Review.find({ reviewStatus: true })).length;
    const Reviews = await Review.find({ reviewStatus: true })
      .populate('revieweeId')
      .populate('reviewerId')
      .populate('roadmapId')
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
    res
      .status(200)
      .json({ message: 'success', reviews: Reviews, pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const DeleteRecording=async (req:Request, res: Response)=>{
  try {
    const {videoName}=req.params
    const savePath = path.join(__dirname, "../../public", "reviewrecording",videoName as string);
    await unlink(savePath)
    return HttpResponse(HttpStatus.OK,HttpMessage.success,res)
  } catch (error) {
    console.log(error)
    return HttpResponse(HttpStatus.SERVER_ERROR,HttpMessage.server_error,res)
  }
}

export default {
  ReviewController,
  DeleteRecording
};
