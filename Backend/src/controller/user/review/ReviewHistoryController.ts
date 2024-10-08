import { Request, Response } from 'express';
import { IUser } from '../../../model/User';
import Review, { IFeedback } from '../../../model/Review';
import { PAGE_LIMIT } from '../CourseController';
import {
  minLengthValidator,
  spaceValidator,
  specialCharValidator,
} from '../../../helper/validationHelper';
import { isValidObjectId } from 'mongoose';

const GetHistory = async (req: Request, res: Response) => {
  try {
    const { page } = req.query;
    const user = req.user as IUser;
    const length = (await Review.find()).length;
    if (user.authorization === 'reviewer') {
      const reviewHistory = await Review.find({
        reviewerId: user.id,
        reviewStatus: true,
      })
        .populate(['roadmapId', 'revieweeId'])
        .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT);
      res
        .status(200)
        .json({
          message: 'success',
          reviews: reviewHistory,
          pageLength: length,
        });
    } else {
      const reviewHistory = await Review.find({
        revieweeId: user.id,
        reviewStatus: true,
      })
        .populate('roadmapId')
        .populate('reviewerId')
        .skip((parseInt(page as string) - 1) * PAGE_LIMIT)
        .limit(PAGE_LIMIT);

      res
        .status(200)
        .json({
          message: 'success',
          reviews: reviewHistory,
          pageLength: length,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

// type ExtendedFeedback = Omit<Document, keyof Document> & IFeedback;

const AddFeedback = async (req: Request, res: Response) => {
  try {
    const user=req.user as IUser
    const { reviewId } = req.params;
    const { comment, star } = req.body;
    if (!isValidObjectId(reviewId)) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    if (!star || !comment) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    if (spaceValidator(comment)) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    if (specialCharValidator(comment)) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    if (minLengthValidator(comment)) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    //the review object to be updated
    const updateReview = await Review.findById(reviewId);
    if (!updateReview) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    if(user.authorization==='reviewer'){
        //that logic here
        const feedbackObject={
            reviewerFeedback:{
                comment:comment,
                star:star
            }
        } as IFeedback
        if(!updateReview.feedback){
            await Review.updateOne({_id:reviewId},{$set:{feedback:feedbackObject}})
        }else{
            updateReview.feedback.reviewerFeedback={
                comment:comment,
                star:star
            }
        }
        const updatedReview=await (await updateReview.save()).populate('roadmapId')
        res.status(200).json({ message: 'success',review:updatedReview });

    }else{
        const feedbackObject={
            revieweeFeedback:{
                comment:comment,
                star:star
            }
        } as IFeedback
        if(!updateReview.feedback){
            await Review.updateOne({_id:reviewId},{$set:{feedback:feedbackObject}})
        }else{
            updateReview.feedback.revieweeFeedback={
                comment:comment,
                star:star
            }
        }
        const updatedReview=await updateReview.save()
        res.status(200).json({ message: 'success',review:updatedReview });

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetHistory,
  AddFeedback,
};
