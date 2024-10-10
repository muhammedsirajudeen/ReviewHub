import { Request, Response } from 'express';
import Review, { IReview } from '../../model/Review';
import { PAGE_LIMIT } from '../user/CourseController';
import { IUser } from '../../model/User';
import Approval from '../../model/Approval';
import { IRoadmap } from '../../model/Roadmap';
import { ICourse } from '../../model/Course';
import { addDelayedTask } from '../../helper/bullmqIntegration';
import ffmpeg from 'fluent-ffmpeg';

import path from 'path';
import { existsSync } from 'fs';
// import Notification from '../../model/Notification';
import Wallet from '../../model/Wallet';
import { REVIEW_POINT } from '../user/review/ReviewController';
import mongoose from 'mongoose';
import Notification from '../../model/Notification';

interface ExtendedRoadmapProps extends Omit<IRoadmap, 'courseId'> {
  courseId: ICourse;
}

interface ExtendedReviewProps extends Omit<IReview, 'roadmapId'> {
  roadmapId: ExtendedRoadmapProps;
}
function estimateDuration(fileSizeBytes: number): number {
  const bitRateKbps = 3400;
  // Convert file size from bytes to bits
  const fileSizeBits = fileSizeBytes * 8;

  // Convert bit rate from Kbps to bits per second
  const bitRateBps = bitRateKbps * 1000;

  // Calculate duration in seconds
  const durationSeconds = fileSizeBits / bitRateBps;

  // Convert duration to hours, minutes, and seconds
  // const hours = Math.floor(durationSeconds / 3600);
  // const minutes = Math.floor((durationSeconds % 3600) / 60);
  // const seconds = Math.floor(durationSeconds % 60);

  return durationSeconds;
}

const getVideoDuration = async (videoPath: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      // Extract duration from metadata
      const duration = metadata.format.size;
      resolve(duration);
    });
  });
};

//dont forget to add reviewer id here

const GetReviews = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    let { page } = req.query ?? '1';
    const length = (await Review.find()).length;
    const Reviews = (await Review.find({
      reviewStatus: false,
      scheduledDate: { $exists: true },
      reviewerId: { $exists: false },
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
    res.status(200).json({
      message: 'success',
      reviews: filteredReviews,
      pageLength: length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

//add that false flag everywhere dont forget
const CommittedReview = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const committedReview = await Review.find({ reviewerId: user.id,reviewStatus:false }).populate(
      'roadmapId'
    );

    res.status(200).json({ message: 'success', reviews: committedReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

//TODO: here check if there is date collission review joining based on date collission
const CommitReview = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { reviewId } = req.params;
    if (!reviewId) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const updateReview = await Review.findById(reviewId);
    //not chaining for better readability i guess
    if (!updateReview) {
      return res.status(404).json({ message: 'Requested resource not found' });
    }
    updateReview.reviewerId = user.id;
    await updateReview.save();
    //schedule the job here at the scheduled date
    const newDate = new Date();
    const dbDate = new Date(updateReview.scheduledDate);
    const diff = dbDate.getTime() - newDate.getTime();
    console.log(diff);
    addDelayedTask(
      {
        revieweeId: updateReview.revieweeId.toHexString(),
        reviewId: updateReview.id,
        reviewerId: updateReview.reviewerId.toHexString(),
      },
      diff
    );
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

const CancelReview = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { reviewId } = req.params;
    const updateReview = await Review.updateOne(
      { reviewerId: user.id, _id: reviewId },
      { $unset: { reviewerId: 1 } }
    );
    if (!updateReview) {
      return res.status(404).json({ message: 'requested resource not found' });
    }
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error occured' });
  }
};

const ReviewStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { reviewId } = req.body;
    const pathName = path.join(__dirname, '../../public', 'reviewrecording');
    const finalPath = `${pathName}/reviewer-${reviewId}.webm`;
    console.log(finalPath);
    const exists = existsSync(finalPath);
    console.log(exists);
    if (exists) {
      const duration = await getVideoDuration(finalPath);
      const estimateduration: number = await estimateDuration(
        duration as number
      );

      console.log(estimateduration);
      // the 10 is a placeholder just give 1 for now 
      if (estimateduration > 1) {
        //this line is suscetible
        // await Notification.deleteMany({reviewId:reviewId})
        const reviewStatus=await Review.findById(reviewId)
        if(!reviewStatus){
          return res.status(404).json({message:'resource not found'})
        }
        reviewStatus.reviewStatus=true
        await reviewStatus.save()
        const userWallet=await Wallet.findById(user.walletId)
        if(!userWallet){
          return res.status(404).json({message:'requested resource not found'})
        }
        await Notification.deleteMany({reviewId:reviewId})
        let flag=false
        userWallet.history.forEach((history)=>{
          if(history.reviewId?.toHexString()===reviewId){
            flag=true
          }
        })
        console.log(flag)
        if(!flag){

          userWallet.redeemable+=REVIEW_POINT
          userWallet.history.push(
            {
              type:'reviewpayment',
              amount:REVIEW_POINT,
              status:true,
              paymentDate:new Date(),
              reviewId:new mongoose.Types.ObjectId(reviewId as string)
            }
          )
          await userWallet.save()
        }
        return res.status(200).json({ message: 'success the duration is enough' });
      } else {
        return res.status(400).json({ message: 'Bad Request' });
      }
    } else {
      return res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

export default {
  GetReviews,
  CommitReview,
  CancelReview,
  CommittedReview,
  ReviewStatus,
};
