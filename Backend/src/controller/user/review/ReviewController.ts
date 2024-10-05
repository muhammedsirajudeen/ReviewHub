import { Request, Response } from 'express';
import { IUser } from '../../../model/User';
import Review from '../../../model/Review';
import Roadmap from '../../../model/Roadmap';
import Course from '../../../model/Course';
import Wallet from '../../../model/Wallet';
import mongoose from 'mongoose';

const REVIEW_POINT=69

const GetReview = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    //alter this code to handle the reviewer side as well
    const userReviews = await Review.find({
      revieweeId: user.id,
      scheduledDate: { $exists: true },
    }).populate('roadmapId');
    res.status(200).json({ message: 'success', reviews: userReviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};



const RequestReview = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = req.user as IUser;
    const { roadmapId } = req.params;
    //check if user has enough balance too
    const walletId=await Wallet.findOne({userId:user.id})
    if(walletId){
      
      if(walletId.balance>=REVIEW_POINT){
        walletId.balance-=REVIEW_POINT
        walletId.history.push(
          {
            type:'review payment',
            amount:REVIEW_POINT,
            paymentDate:new Date(),
            status:false
          }
        )

      }else if(walletId.redeemable>=REVIEW_POINT){
        walletId.redeemable-=REVIEW_POINT
        walletId.history.push(
          {
            type:'review payment',
            amount:REVIEW_POINT,
            paymentDate:new Date(),
            status:false
          }
        )
      }
      else{
        return res.status(402).json({message:'insufficient funds'})
      }
    }else{
      return res.status(404).json({message:'requested resource not found'})
    }
    //check if its already there or if limit is more than three
    const checkReview = await Review.findOne({
      revieweeId: user.id,
      roadmapId: roadmapId,
    });
    if (checkReview) {
      return res.status(409).json({ message: 'review already requested' });
    }
    //second check
    const checkCount = (
      await Review.find({ revieweeId: user.id, reviewStatus: false })
    ).length;
    if (checkCount > 3) {
      return res.status(429).json({ message: 'review request exceeded' });
    }

    const checkRoadmap = await Roadmap.findById(roadmapId);
    console.log(checkRoadmap);
    if (checkRoadmap) {
      const courseId = await Course.findById(checkRoadmap.courseId);
      const newReview = new Review({
        roadmapId: checkRoadmap?.id,
        revieweeId: user.id,
        instantReview: false,
        reviewStatus: false,
        domainName: courseId?.domain,
      });
      await walletId.save()
      const newReviews=await newReview.save();
      await session.commitTransaction();

      res.status(201).json({ message: 'success',review:newReviews });
    } else {
      res.status(404).json({ message: 'resource not found' });
    }
  } catch (error) {
    console.log(error);
    await session.abortTransaction();

    res.status(500).json({ message: 'server error occured' });
  }finally{
    session.endSession();

  }
};

const GetScheduledRoadmaps = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    //finding the roadmaps that doesnt have date set yet
    const scheduledRoadmaps = await Review.find({
      revieweeId: user.id,
      scheduledDate: { $exists: false },
    }).populate('roadmapId');
    res.status(200).json({ message: 'success', requested: scheduledRoadmaps });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const ScheduleReview = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { roadmapId } = req.params;
    const { date } = req.body;
    const updateReview = await Review.findOne({
      revieweeId: user.id,
      roadmapId: roadmapId,
    });
    if (updateReview) {
      updateReview.scheduledDate = new Date(date);
      const newReview=await updateReview.save();
      console.log(newReview)
      const newReviews=await Review.findById(newReview.id).populate('roadmapId')
      res.status(200).json({ message: 'success',reviews:newReviews });
    } else {
      res.status(404).json({ message: 'requested resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const CancelReview = async (req: Request, res: Response) => {
  try {
    // const user=req.user as IUser
    const {reviewId}=req.params
    if(!reviewId){
      return res.status(400).json({message:"bad request"})
    }
    await Review.deleteOne({_id:reviewId})
    // dont keep refund for now
    // const wallet=await Wallet.findOne({userId:user.id})
    // if(wallet){
      
    // }else{
    //   return res.status(404).json({message:"resource not found"})
    // }
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetReview,
  GetScheduledRoadmaps,
  RequestReview,
  ScheduleReview,
  CancelReview,
};
