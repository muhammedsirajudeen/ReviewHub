import express from 'express';
import passport from 'passport';
const router = express.Router();

import './passport-setup/passport-setup';
import UploadHandler from '../helper/fileuploadHelper';
import ReviewerController from '../controller/reviewer/ReviewerController';
import ReviewController from '../controller/reviewer/ReviewController';

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
  passport.authenticate('jwt',{session:false}),
  ReviewController.GetReviews
)

router.put(
  '/review/:reviewId',
  passport.authenticate('jwt',{session:false}),
  ReviewController.CommitReview
)

router.delete(
  '/review',
  passport.authenticate('jwt',{session:false}),
  ReviewController.CancelReview
)
export default router;
