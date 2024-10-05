import { Request, Response } from 'express';
import Review, { IReview } from '../../model/Review';
import { PAGE_LIMIT } from '../user/CourseController';
import { IUser } from '../../model/User';
import Approval from '../../model/Approval';
import { IRoadmap } from '../../model/Roadmap';
import { ICourse } from '../../model/Course';

interface ExtendedRoadmapProps extends Omit<IRoadmap, 'courseId'> {
  courseId: ICourse;
}

interface ExtendedReviewProps extends Omit<IReview, 'roadmapId'> {
  roadmapId: ExtendedRoadmapProps;
}

//dont forget to add reviewer id here

const GetReviews = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    let { page } = req.query ?? '1';
    const length = (await Review.find()).length;
    const Reviews = (await Review.find({
      reviewStatus: false,
      scheduledDate: { $exists: true },
    })
      .populate({
        path: 'roadmapId', // Populate the roadmapId
        populate: {
          path: 'courseId', // Populate the courseId inside roadmapId
        },
      })
      .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT)) as unknown as Array<ExtendedReviewProps>;
    //now check filter out some stuff here
    const checkApproval = await Approval.findOne({ userId: user.id });
    const domain = checkApproval?.domain;
    const filteredReviews = Reviews.filter((Review) => {
      return Review.roadmapId.courseId.domain === domain;
    });
    //each reviewer only gets domain from their specific stacks
    res
      .status(200)
      .json({
        message: 'success',
        reviews: filteredReviews,
        pageLength: length,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const CommitReview = async (req: Request, res: Response) => {
  try {
    const user=req.user as IUser
    const {reviewId}=req.params
    if(!reviewId){
        return res.status(400).json({message:"Bad Request"})
    }
    const updateReview=await Review.findById(reviewId)
    //not chaining for better readability i guess
    if(!updateReview){
        return res.status(404).json({message:"Requested resource not found"})
    }
    updateReview.reviewerId=user.id
    await updateReview.save()
    res.status(200).json({message:'success'})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const CancelReview=async (req:Request,res:Response)=>{
    try{
        const user=req.user as IUser
        const {reviewId}=req.params
        const updateReview=await Review.updateOne({reviewerId:user.id,_id:reviewId},{$unset:{reviewerId:1}})
        if(!updateReview){
            return res.status(404).json({message:"requested resource not found"})

        }
        res.status(200).json({message:"success"})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Server error occured"})
    }
}

export default {
  GetReviews,
  CommitReview,
  CancelReview
};
