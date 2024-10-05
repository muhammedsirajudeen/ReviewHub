import { Request, Response } from 'express';
import Review, { IReview } from '../../model/Review';
import { PAGE_LIMIT } from '../user/CourseController';
import { IUser } from '../../model/User';
import Approval from '../../model/Approval';
import { IRoadmap } from '../../model/Roadmap';
import { ICourse } from '../../model/Course';

interface ExtendedRoadmapProps extends Omit<IRoadmap,'courseId'>{
    courseId:ICourse
}

interface ExtendedReviewProps extends Omit<IReview,'roadmapId'>{
    roadmapId:ExtendedRoadmapProps
}

const GetReviews = async (req: Request, res: Response) => {
  try {
    const user=req.user as IUser
    let { page } = req.query ?? '1';
    const length = (await Review.find()).length;
    const Reviews = await Review.find({
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
      .limit(PAGE_LIMIT) as unknown as Array<ExtendedReviewProps>
      //now check filter out some stuff here
      const checkApproval=await Approval.findOne({userId:user.id})
      const domain=checkApproval?.domain
      const filteredReviews=Reviews.filter((Review)=>{
        return(
            Review.roadmapId.courseId.domain===domain
        )
      })
      console.log(filteredReviews)
    //each reviewer only gets domain from their specific stacks
    res
      .status(200)
      .json({ message: 'success', reviews: filteredReviews, pageLength: length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetReviews,
};
