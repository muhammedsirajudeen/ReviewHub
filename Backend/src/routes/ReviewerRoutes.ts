import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
const router = express.Router();

import './passport-setup/passport-setup';
import UploadHandler from '../helper/fileuploadHelper';
import ReviewerController from '../controller/reviewer/ReviewerController';
import ReviewController from '../controller/reviewer/ReviewController';
import DashboardController from '../controller/reviewer/DashboardController';
import HttpResponse, { HttpMessage, HttpStatus } from '../helper/resConstants';
import { IUser } from '../model/User';

const ReviewerMiddleware=(req:Request,res:Response,next:NextFunction)=>{
  try{
    const user=req.user as IUser
    if(user.authorization!=='reviewer'){
      return HttpResponse(HttpStatus.UNAUTHORIZED,HttpMessage.unauthorized,res)
    }else{
      next()
    }
  }catch(error){
    console.log(error)
    return HttpResponse(HttpStatus.SERVER_ERROR,HttpMessage.server_error,res)
  }
}

router.get(
  '/approval',
  passport.authenticate('jwt', { session: false }),
  ReviewerController.ApprovalStatus
);

router.post(
  '/approval',
  passport.authenticate('jwt', { session: false }),
  UploadHandler('pdf').single('file'),
  ReviewerController.ReviewerApproval
);

//review management
router.get(
  '/reviews',
  passport.authenticate('jwt', { session: false }),
  ReviewerMiddleware,
  ReviewController.GetReviews
);

router.get(
  '/review/committed',
  passport.authenticate('jwt', { session: false }),
  ReviewerMiddleware,
  ReviewController.CommittedReview
);
router.put(
  '/review/:reviewId',
  passport.authenticate('jwt', { session: false }),
  ReviewerMiddleware,
  ReviewController.CommitReview
);

router.delete(
  '/review/:reviewId',
  passport.authenticate('jwt', { session: false }),
  ReviewerMiddleware,
  ReviewController.CancelReview
);
router.put(
  '/reviewcompletion',
  passport.authenticate('jwt', { session: false }),
  ReviewerMiddleware,
  ReviewController.ReviewStatus
);

//dashboard management

router.get(
  '/dashboard',
  passport.authenticate('jwt', { session: false }),
  ReviewerMiddleware,
  DashboardController.GetReviewerDashboard
);

export default router;
