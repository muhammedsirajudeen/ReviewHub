import { Request, Response } from 'express';
import { IUser } from '../../../model/User';
import Review from '../../../model/Review';
import Roadmap from '../../../model/Roadmap';
import Course from '../../../model/Course';
import Wallet from '../../../model/Wallet';
import mongoose from 'mongoose';
import path from 'path';
import { appendFile, existsSync, mkdirSync } from 'fs';
import HttpResponse, { HttpMessage, HttpStatus } from '../../../helper/resConstants';

export const REVIEW_POINT=70

const GetReview = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    //alter this code to handle the reviewer side as well
    const userReviews = await Review.find({
      revieweeId: user.id,
      scheduledDate: { $exists: true },
      reviewStatus:false
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
      reviewStatus:false
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
      reviewStatus:false
    }).populate('roadmapId');
    res.status(200).json({ message: 'success', requested: scheduledRoadmaps });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const ScheduleReview = async (req: Request, res: Response) => {
  try {
    // const user = req.user as IUser;
    // const { roadmapId } = req.params;
    const { date,reviewId } = req.body;
    const checkReview=await Review.findOne({scheduledDate:new Date(date),reviewStatus:false})
    if(checkReview){
      return HttpResponse(HttpStatus.COLLISSION,HttpMessage.user_collission,res)
    }
    const updateReview = await Review.findById(reviewId)
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
    const checkReview=await Review.findById(reviewId)
    if(checkReview?.reviewerId){
      return res.status(400).json({message:"reviewer already scheduled"})
    }
    await Review.updateOne({_id:reviewId},{$unset:{scheduledDate:1}})
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

const CallerFetcher=async (req:Request,res:Response)=>{
  try{
    const user=req.user as IUser
    const {reviewId}=req.params
    if(!reviewId){
      return res.status(400).json({message:'Bad Request'})
    }
    const findReview=await Review.findById(reviewId)
    if(!findReview){
      return res.status(404).json({message:"Bad Request"})
    }
    if(user.authorization==='reviewer'){
      return res.status(200).json({message:"success",call:findReview.revieweeId})
    }else{
      return res.status(200).json({message:"success",call:findReview.reviewerId})
    }
  }catch(error){
    console.log(error)
    res.status(500).json({message:'server error occured'})
  }
}


const ReviewRecord = (req:Request, res:Response) => {
  try {
    const buffer = req.file?.buffer;
    const originalname = req.file?.originalname;
    const savePath = path.join(__dirname, "../../../public", "reviewrecording");

    // Check if the directory exists; if not, create it
    if (!existsSync(savePath)) {
      mkdirSync(savePath, { recursive: true });
    }

    if (buffer) {
      const filePath = path.join(savePath, originalname as string);
        appendFile(filePath, buffer, (err) => {
        if (err) {
          console.error('Error appending video chunk:', err);
          return res.status(500).send('Error appending video chunk');
        }

        return res.send({ message: 'success' });
      });
    } else {
      return res.status(400).send('No file provided');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error occurred" });
  }
};




export default {
  GetReview,
  GetScheduledRoadmaps,
  RequestReview,
  ScheduleReview,
  CancelReview,
  CallerFetcher,
  ReviewRecord
};
